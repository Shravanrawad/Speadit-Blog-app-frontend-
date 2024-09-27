'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

function Homepage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts`);
        setPosts(response.data.data);
        console.log('Fetched posts:', response.data.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className='w-full'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4 p-4'>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className='border-[1px] rounded-lg p-3 cursor-pointer hover:shadow-sm transition-all ease-in-out'>
              <img
                src={post.imageurl}
                alt='img'
                width={500}
                height={500}
                className='h-[200px] w-full object-cover rounded-lg'
              />
              <div className='mt-3 items-baseline flex flex-col gap-2'>

                <div className='flex items-center space-x-2'>

                  <div className='h-[30px] w-[30px] rounded-full overflow-hidden'>
                    <img src={post.useravatar} alt={post.username} className='h-full w-full object-cover' />
                  </div>

                  <h2 className='text-[10px] bg-sky-100 p-1 rounded-full px-2 text-primary'>
                    {post.username}
                  </h2>
                </div>

                <h2 className='font-bold'>{post.title.substring(0, 29)}...</h2>
                <h2 className='text-gray-500 text-sm'>{post.content.substring(0, 70)}...</h2>

                <Link href={`/singelpostpage/${post.documentId}`} className='w-full'>
                  <h2 className='p-2 text-whites px-3 border-[1px] border-primary text-primary rounded-full w-full text-center text-[11px] mt-2 cursor-pointer hover:bg-primary hover:text-white'>
                    Read More
                  </h2>
                </Link>

              </div>
            </div>
          ))
        ) : (
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item, index) => (
            <div key={index} className='h-[220px] bg-slate-100 w-full rounded-lg animate-pulse'>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Homepage;
