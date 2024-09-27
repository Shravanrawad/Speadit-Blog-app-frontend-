'use client'; 

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Editpage = ({ params }) => {
  const { id } = params;
  const router = useRouter(); 
  const [post, setPost] = useState({
    title: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts/${id}`);
          const postData = response.data.data; 
          setPost({
            title: postData.title,
            content: postData.content,
          });
        } catch (error) {
          console.error('Error fetching the post:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchPost();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost({
      ...post,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts/${id}`, {
        data: post, 
      });
      router.push('/profile'); 
    } catch (error) {
      console.error('Error updating the post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center text-xl font-bold">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-white text-black">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md mt-[-100px]">
        <h1 className="text-3xl font-semibold text-center mb-6">Edit Post</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-lg font-medium text-gray-700">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={post.title}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="content" className="block text-lg font-medium text-gray-700">Content:</label>
            <textarea
              id="content"
              name="content"
              value={post.content}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              rows="6"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-semibold rounded-md shadow-sm focus:outline-none ${
              loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Editpage;
