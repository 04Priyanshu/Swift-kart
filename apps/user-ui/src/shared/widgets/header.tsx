"use client";
import Link from 'next/link';
import React from 'react'
import {  HeartIcon, Search, ShoppingCartIcon } from 'lucide-react';
import ProfileIcon from '../../assets/svgs/profile-icon';
import HeaderBottom from './header-bottom';
import useUser from '../../hooks/useUser';
import AnimatedSwiftKartLogo from '../components/logo';
import { useStore } from 'apps/user-ui/src/store';

const Header = () => {  
  const {user, isLoading} = useUser();
  const wishlist = useStore((state : any)=>state.wishlist);
  const cart = useStore((state : any)=>state.cart);
  return (
    <div className='w-full bg-white'>
        <div className='w-[80%] py-5 m-auto flex items-center justify-between' >
            <div>
                <Link href={"/"}>
                {/* <span className='text-3xl font-[500]'>Swift Kart</span> */}
                <AnimatedSwiftKartLogo/>
                </Link>
            </div>
            <div className='w-[50%] relative'>
                <input type="text" placeholder='Search for products' className='w-full px-4 font-Poppins font-medium border-[2.5px] border-[#3489FF] outline-none h-[55px] rounded-full' />
                <div className='w-[60px] h-[55px]  rounded-full flex items-center justify-center absolute right-0 top-0'>
                    <Search className='w-6 h-6' />
                </div>
                
            </div>
            <div className='flex items-center gap-8'>
                   <div className='flex items-center gap-2'>
                   {!isLoading && user?(
                    <>
                    <Link href={"/profile"} className='border-2 w-[50px] h-[50px] rounded-full border-[#010f1c1a] flex items-center justify-center'>
                    <ProfileIcon/>
                    </Link>
                    <Link href={"/profile"}>
                    <span className='font-medium block'>Hello,</span>
                    <span className='font-semibold'>{user?.name.split(" ")[0]}</span>
                    </Link>
                    </>
                   ):(
                    <>
                    <Link href={"/login"} className='border-2 w-[50px] h-[50px] rounded-full border-[#010f1c1a] flex items-center justify-center'>
                    <ProfileIcon/>
                    </Link>

                    <Link href={"/login"}>
                   <span className='font-medium block'>Hello,</span>
                   <span className='font-semibold'>
                     {isLoading ? (
                       <div className="flex space-x-1">
                         <div className="w-2 h-4 bg-gray-400 rounded animate-pulse"></div>
                         <div className="w-2 h-4 bg-gray-400 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                         <div className="w-2 h-4 bg-gray-400 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                       </div>
                     ) : "Sign In"}
                   </span>
                   </Link>
                    </>
                   )}
                   
                  
                   </div>
                   <div className='flex items-center gap-5'>
                    <Link href={"/wishlist"} className='relative'>
                    <HeartIcon/>
                    <div className='w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]'>
                        <span className='text-white text-sm font-medium'>{wishlist?.length}</span>
                    </div>
                    </Link>
                    <Link href={"/cart"} className='relative'>
                    <ShoppingCartIcon/>
                    <div className='w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]'>
                        <span className='text-white text-sm font-medium'>{cart?.length}</span>
                    </div>
                    </Link>
                   </div>
            </div>
        </div>
        <div className='border-b border-b-[#99999938]'/>
            <HeaderBottom/>
    </div>
  )
}

export default Header;