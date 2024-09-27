'use client';

import { SignOutButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"

import { EditIcon, TrashIcon } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts`);
        const userPosts = response.data.data.filter(post => post.userId === user.id);
        setPosts(userPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const fetchSavedPosts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/saveposts`);
        const userSavedPosts = response.data.data.filter(post => post.userId === user.id);
        setSavedPosts(userSavedPosts);
      } catch (error) {
        console.error('Error fetching saved posts:', error);
      }
    };

    if (user) {
      fetchPosts();
      fetchSavedPosts();
    }
  }, [user]);


  const handleDelete = async (postId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts/${postId}`);
      setPosts(prevPosts => prevPosts.filter(post => post.documentId !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  

  const handleDeleteSavedPost = async (postId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_APP_URL}/api/saveposts/${postId}`);
      setSavedPosts(prevSavedPosts => prevSavedPosts.filter(post => post.documentId !== postId));
    } catch (error) {
      console.error('Error deleting saved post:', error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-3 p-5 bg-white text-black">
        <img
          src={user?.imageUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        <h2 className="text-2xl font-semibold">{user?.firstName} {user?.lastName}</h2>
        <p className="text-lg text-gray-600">{user?.emailAddresses[0]?.emailAddress}</p>
        <Button className="bg-blue-500 text-white rounded-full w-[130px] mt-4">
          <SignOutButton />
        </Button>
      </div>

      <div className='p-5 max-w-full mx-auto bg-white shadow-md rounded-lg'>
        <Tabs defaultValue="account">
          <div className="border-b border-gray-200">
            <TabsList className="flex space-x-4">
              <TabsTrigger
                value="account"
                className="py-2 px-4 text-1xl text-gray-600 hover:text-blue-500 border-b-2 border-transparent hover:border-blue-500"
              >
                <strong>Posts</strong>
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="py-2 px-4 text-1xl text-gray-600 hover:text-blue-500 border-b-2 border-transparent hover:border-blue-500"
              >
                <strong>Saved Posts</strong>
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent
            value="account"
            className="p-4 bg-gray-50 rounded-b-lg"
          >
            <div className='w-full'>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4 p-4'>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div key={post.id} className='border-[1px] rounded-lg p-3 cursor-pointer hover:shadow-sm transition-all ease-in-out'>
                      <Link href={`/singelpostpage/${post.documentId}`}>
                        <img
                          src={post.imageurl}
                          alt='Post Image'
                          className='h-[200px] w-full object-cover rounded-lg'
                        />
                      </Link>
                      <div className='mt-3 items-baseline flex flex-col gap-2'>
                        <div className='flex items-center space-x-2'>
                          <div className='h-[30px] w-[30px] rounded-full overflow-hidden'>
                            <img src={post.useravatar} alt={post.username} className='h-full w-full object-cover' />
                          </div>
                          <h2 className='text-[10px] bg-sky-100 p-1 rounded-full px-2 text-primary'>
                            {post.username}
                          </h2>
                        </div>
                        <h2 className='font-bold text-black'>{post.title.substring(0, 25)}...</h2>
                        <h2 className='text-gray-500 text-sm'>{post.content.substring(0, 60)}...</h2>
                      </div>

                      <div className='flex justify-end space-x-2 mt-3'>
                        <button className="text-blue-500 hover:text-blue-700">
                          <Link href={'/editpost/' + post.documentId}>
                            <EditIcon />
                          </Link>
                        </button>

                        <Dialog>
                          <DialogTrigger>
                            <button className="text-red-500 hover:text-red-700 mt-1">
                              <TrashIcon />
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Are you absolutely sure?</DialogTitle>
                              <DialogDescription>
                                This action cannot be undone. This will permanently delete your post
                                and remove your data from our servers.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button onClick={() => handleDelete(post.documentId)}>Continue</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='text-center col-span-full'>
                    <p className='text-gray-500'>No posts created by you.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="password"
            className="p-4 bg-gray-50 rounded-b-lg"
          >
            <div className='w-full'>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4 p-4'>
                {savedPosts.length > 0 ? (
                  savedPosts.map((post) => (
                    <div key={post.id} className='border-[1px] rounded-lg p-3 cursor-pointer hover:shadow-sm transition-all ease-in-out'>
                      <Link href={`/singelpostpage/${post.documentId}`}>
                        <img
                          src={post.imageurl}
                          alt='Saved Post Image'
                          className='h-[200px] w-full object-cover rounded-lg'
                        />
                      </Link>
                      <div className='mt-3 items-baseline flex flex-col gap-2'>
                        <div className='flex items-center space-x-2'>
                          <div className='h-[30px] w-[30px] rounded-full overflow-hidden'>
                            <img src={post.useravatar} alt={post.username} className='h-full w-full object-cover' />
                          </div>
                          <h2 className='text-[10px] bg-sky-100 p-1 rounded-full px-2 text-primary'>
                            {post.username}
                          </h2>
                        </div>
                        <h2 className='font-bold'>{post.title.substring(0, 25)}...</h2>
                        <h2 className='text-gray-500 text-sm'>{post.content.substring(0, 60)}...</h2>
                      </div>

                      <div className='flex justify-end space-x-2 mt-3'>
                        <Dialog>
                          <DialogTrigger>
                            <button className="text-red-500 hover:text-red-700 mt-1">
                              Remove
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Are you absolutely sure?</DialogTitle>
                              <DialogDescription>
                                This action cannot be undone. This will permanently delete your saved post
                                and remove your data from our servers.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button onClick={() => handleDeleteSavedPost(post.documentId)}>Continue</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='text-center col-span-full'>
                    <p className='text-gray-500'>No saved posts.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ProfilePage;
