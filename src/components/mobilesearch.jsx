import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SearchIcon } from 'lucide-react';

function Mobilesearch({ mobileInputValue, setMobileInputValue, posts , setShowSearch}) {
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    if (Array.isArray(posts)) {
      const filtered = posts.filter(post =>
        post?.title?.toLowerCase().includes(mobileInputValue.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [mobileInputValue, posts]);

  return (
    <div className='absolute mt-[150px] h-full w-full flex justify-center bg-white shadow-sm'>
      <div className='p-4 h-[600px] w-full max-w-lg overflow-y-auto bg-white'>
        {mobileInputValue.length > 0 && filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div key={post.id} className='py-2'>
              <Link href={`/singelpostpage/${post.documentId}`}>
                <div onClick={() => {
                  setMobileInputValue('')
                  setShowSearch(false)
                }} className='flex items-center gap-2 text-black hover:bg-gray-100 p-2'>
                  <SearchIcon className='h-4 w-4' />
                  <>{post.title.substring(0, 40)}...</>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No results found</p>
        )}
      </div>
    </div>
  );
}

export default Mobilesearch;
