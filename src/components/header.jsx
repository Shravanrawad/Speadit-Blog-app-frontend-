'use client'; 

import { ArrowLeft, HomeIcon, MenuIcon, PlusCircleIcon, SearchIcon, UserIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from './ui/input';
import { Button } from './ui/button';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import Mobilesearch from './mobilesearch';

const routes = [
    { label: 'Home', icon: HomeIcon, href: '/home' },
    { label: 'Create Post', icon: PlusCircleIcon, href: '/createpost' },
    { label: 'Profile', icon: UserIcon, href: '/profile' }
];

function Header() {
    const [showsearch, setShowSearch] = useState(false);
    const { isSignedIn } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [mobileInputValue, setMobileInputValue] = useState('');
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);

    
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts`);
                const data = await response.json();
                setPosts(data.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

    useEffect(() => {
        if (Array.isArray(posts)) {
            const filtered = posts.filter(post =>
                post.title.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredPosts(filtered);
        }
    }, [inputValue, posts]);
    
    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <>
            <div className="w-full flex items-center">

                <div className="hidden lg:flex w-full p-2">
                    <div className="flex w-full items-center justify-between">
                        <Link href="/home">
                            <h1 className="text-2xl font-sans">Spread<strong className="text-sky-500">It</strong></h1>
                        </Link>

                        <div className="w-[500px] flex items-center border border-zinc-100 rounded-full relative px-3">
                            <SearchIcon />
                            <Input
                                placeholder="Search Blog..."
                                className="flex-1 rounded-full border-none focus:outline-none"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            {inputValue.length > 0 && filteredPosts.length > 0 && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-zinc-100 rounded-lg shadow-lg">
                                    <div className="p-4 h-[300px] overflow-y-auto">
                                        {filteredPosts.map(post => (
                                            <div key={post.id}>
                                                <Link href={`/singelpostpage/${post.documentId}`}>
                                                    <div onClick={() => setInputValue('')} className='flex items-center gap-2 hover:bg-gray-100 p-2'>
                                                      <SearchIcon className='h-4 w-4'/>
                                                      <>{post.title.substring(0, 40)}...</>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {isSignedIn ? (
                            <div className="flex items-center gap-4">
                                <Link href="/home"><HomeIcon className="h-6 w-6" /></Link>
                                <Link href="/createpost"><PlusCircleIcon className="h-6 w-6" /></Link>
                                <Link href="/profile"><UserIcon className="h-6 w-6" /></Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                <Link href="/sign-in"><Button className="rounded-full bg-popover border border-zinc-100">SignIn</Button></Link>
                                <Link href="/sign-up"><Button className="rounded-full border border-zinc-100">Get Started</Button></Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center lg:hidden w-full p-2">
                    {!showsearch ? (
                        <div className="flex justify-between items-center p-3 w-full">
                            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger onClick={() => setIsOpen(true)}>
                                    <MenuIcon />
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0">
                                    <div className="space-y-4 py-4 flex flex-col h-full bg-white">
                                        <div className="px-3 py-2 flex-1">
                                            <Link href="/home" className="flex items-center pl-3 mb-14" onClick={handleLinkClick}>
                                                <h1 className="text-2xl font-bold text-white">
                                                    Spread<strong className="text-sky-500">It</strong>
                                                </h1>
                                            </Link>

                                            {isSignedIn ? (<div className="space-y-1">
                                                {routes?.map(item => (
                                                    <Link
                                                        href={item.href}
                                                        key={item.href}
                                                        className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition"
                                                        onClick={handleLinkClick}
                                                    >
                                                        <div className="flex items-center flex-1">
                                                            <item.icon className="h-5 w-5 mr-3" />
                                                            {item.label}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>) : 
                                                 (<div className="flex items-center gap-1">
                                                    <Link href="/sign-in"><Button className="rounded-full bg-popover border border-zinc-100">SignIn</Button></Link>
                                                    <Link href="/sign-up"><Button className="rounded-full border border-zinc-100">Get Started</Button></Link>
                                                </div>) 
                                            }

                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                            <h1 className="font-sans">Spread<strong className="text-sky-500">It</strong></h1>
                            <SearchIcon onClick={() => setShowSearch(true)} />
                        </div>
                    ) : (
                        <div className="flex justify-between shadow-sm items-center gap-2 p-3 w-full">
                            <ArrowLeft onClick={() => setShowSearch(false)} />
                            <Input
                                className="rounded-full"
                                placeholder="Search Blog ..."
                                value={mobileInputValue}
                                onChange={(e) => setMobileInputValue(e.target.value)}
                            />
                        </div>
                    )}
                </div>

            </div>
            {showsearch && mobileInputValue.length > 0 && <Mobilesearch mobileInputValue={mobileInputValue} setMobileInputValue={setMobileInputValue} posts={posts} setShowSearch={setShowSearch} />}
        </>
    );
}

export default Header;
