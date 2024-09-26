'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { CopyIcon, SaveIcon, ShareIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs'; 
import toast from 'react-hot-toast';

const SkeletonLoader = () => (
  <div className="p-4 flex space-x-4">
    <div className="h-48 bg-gray-200 rounded w-1/2 animate-pulse"></div>
    <div className="flex flex-col justify-between w-1/2">
      <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
      <div className="h-20 bg-gray-200 rounded mb-2 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse w-4/5"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse w-3/5"></div>
    </div>
  </div>
);

const fetchPostAndOthers = async (id) => {
  const postResponse = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts/${id}`);
  const allPostsResponse = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts`);
  return {
    post: postResponse.data.data,
    allPosts: allPostsResponse.data.data,
  };
};

function SinglePostPage({ params }) {
  const { user } = useUser(); 
  const { id } = params;
  const [postData, setPostData] = useState(null);
  const [otherPosts, setOtherPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      const { post, allPosts } = await fetchPostAndOthers(id);
      setPostData(post);
      setOtherPosts(allPosts.filter(otherPost => otherPost.id !== post.id));
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handelsavepost = async (post) => {
    if (!user) {
      toast('Please log in to save posts.');
      return;
    }
  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/saveposts`,
        {
          data: {
            title: post.title,
            content: post.content,
            imageurl: post.imageurl,
            username: post.username,
            useravatar: post.useravatar,
            userId: user.id, 
            postuserId: post.userId, 
          }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`, 
            'Content-Type': 'application/json',
          }
        }
      );
  
      console.log('Post saved successfully:', response.data);
      toast('Post saved successfully!')
    } catch (error) {
      console.error('Error saving post:', error.message);
      toast('Failed to save post.');
    }
  };

  const handleSharePost = async () => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast('Post URL copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy: ', err);
        toast('Failed to copy URL.');
      }
    } else {
      alert('Copying URL is not supported in this browser.');
    }
  };

  if (loading) return <SkeletonLoader />;

  return (
    <div className="p-4">
      <div className="flex flex-col lg:flex-row mb-8">
        <div className="lg:w-1/2 mb-4 lg:mb-0">
          <img
            src={postData.imageurl}
            alt={postData.title}
            className="w-full h-[300px] object-cover rounded-lg"
          />
        </div>
        <div className="lg:w-1/2 lg:pl-4">
          <h1 className="text-2xl font-bold mb-2">{postData.title}</h1>
          <p className="mt-4">{postData.content}</p>
          <div className="mt-4 flex items-center">
            <img
              src={postData.useravatar}
              alt={postData.username}
              className="w-8 h-8 rounded-full mr-2 object-cover"
            />
            <p><strong>{postData.username}</strong></p>
          </div>
          <p className="mt-2"><strong>Publish on:</strong> {new Date(postData.publishedAt).toLocaleDateString()}</p>
          <div className='flex items-center gap-2 mt-2'>
            <Button onClick={() => handelsavepost(postData)} variant='outline' className=' rounded-full flex gap-2 items-center'>
              <SaveIcon className='h-4 w-4'/>Save
            </Button>
            <Button onClick={handleSharePost} variant='outline' className=' rounded-full flex gap-2 items-center'>
              <CopyIcon className='h-4 w-4'/>Copy URL
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Other Blogs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherPosts.map((otherPost) => (
            <Link
              key={otherPost.id}
              href={`/singelpostpage/${otherPost.documentId}`}
              className="p-4  rounded hover:bg-gray-100 transition flex items-start"
            >
              <img
                src={otherPost.imageurl}
                alt={otherPost.title}
                className="w-24 h-24 object-cover rounded-lg shadow-md transition-transform transform hover:scale-105 mr-4"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{otherPost.title}</h3>
                <p className="text-sm text-gray-600">{otherPost.content.substring(0, 100)}...</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SinglePostPage;
