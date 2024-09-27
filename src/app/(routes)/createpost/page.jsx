'use client'

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { LoaderCircle, PlusCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

function CreatePostPage() {
  const { user } = useUser();
  const [image, setSelectedImage] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const username = `${user?.firstName} ${user?.lastName}` || 'Anonymous';
  const useravatar = user?.imageUrl; 
  const userId = user?.id;
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        let imageUrl = null;
  
        if (image) {
            const formDataImage = new FormData();
            formDataImage.append('files', image); 

            const uploadResponse = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/upload`, formDataImage, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
                },
            });

            console.log('Upload response:', uploadResponse.data);
            imageUrl = uploadResponse.data[0].url; 
        }
  
        const formDataPost = new FormData();
        formDataPost.append('data[title]', title);
        formDataPost.append('data[content]', content);
        formDataPost.append('data[username]', username);
        formDataPost.append('data[useravatar]', useravatar);
        formDataPost.append('data[userId]', userId);

        if (imageUrl) {
            formDataPost.append('data[imageurl]', imageUrl);
        }

        for (let pair of formDataPost.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        const response = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts`, formDataPost, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
            },
        });

        console.log('Post created successfully:', response.data);
        setLoading(false);
        
        setTitle('');
        setContent('');
        setSelectedImage(null);
        toast('Post upload successfully')
        router.push('/home')        

    } catch (error) {
        console.error('Error creating post:', error.response ? error.response.data : error);
        if (error.response) {
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
            console.error('Error data:', error.response.data);
        }
        setLoading(false);
    }
};

  return (
  <div className="w-full min-h-screen flex items-center justify-center p-4">
  <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg mt-[-40px] p-6">
   
    <div className="mb-6 text-center">
      <h1 className="text-3xl font-bold text-gray-800">Create a New Post</h1>
      <p className="text-gray-500 mt-2">Share your thoughts and stories with the world!</p>
    </div>

    <div className="flex flex-col md:flex-row gap-6">
    
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <label
          htmlFor="image"
          className="flex items-center justify-center w-full h-[200px] bg-gray-200 border border-gray-300 cursor-pointer rounded-lg hover:bg-gray-300 transition duration-200"
        >
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Selected"
              className="h-full w-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-gray-600">Upload Image</span>
          )}
        </label>
        <input
          id="image"
          type="file"
          className="hidden"
          onChange={handleImageChange}
          required
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <div>
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition duration-200"
          />
        </div>
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your story here..."
            className="w-full h-[150px] p-4 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition duration-200"
            required
          />
        </div>
      </div>
    </div>

   
    <div className="mt-8 flex justify-center">
      <button
        disabled={loading}
        className={`bg-blue-600 text-white py-3 px-8 rounded-full hover:bg-blue-700 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        type="submit"
        onClick={handleSubmit}
      >
        {loading ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          'Publish Post'
        )}
      </button>
    </div>
  </div>
</div>
  

  );
}

export default CreatePostPage;
