"use client";
import {
  AlignLeft,
  ChevronDown,
  HeartIcon,
  ShoppingCartIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { navItems } from "../../configs/constant";
import ProfileIcon from "../../assets/svgs/profile-icon";
import Link from "next/link";
import useUser from "../../hooks/useUser";
import { useStore } from "apps/user-ui/src/store";

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const {user, isLoading} = useUser();
  const wishlist = useStore((state : any)=>state.wishlist);
  const cart = useStore((state : any)=>state.cart);
  //Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`w-full transition-all duration-300 ${
        isSticky ? "fixed top-0 left-0 z-[100] bg-white shadow-lg" : "relative"
      }`}
    >
      <div
        className={`w-[80%] relative m-auto flex items-center justify-between ${
          isSticky ? "pt-3" : "py-0"
        }`}
      >
        {/* all dropdown */}
        <div
          className={`w-[260px] ${
            isSticky && "-mb-2"
          } cursor-pointer flex items-center justify-between px-5 h-[50px] bg-black rounded-full`}
          onClick={() => setShow(!show)}
        >
          <div className="flex items-center gap-2">
            <AlignLeft color="white" />
            <span className="text-white font-medium">All departments</span>
          </div>
          <ChevronDown color="white" />
        </div>

        {/* dropdownv menu */}
        {show && (
          <div
            className={`absolute top-[70px] left-0 w-[260px] h-[260px] bg-[#f5f5f5] shadow-lg rounded-lg ${
              isSticky ? "top-[70px]" : "top-[50px]"
            }`}
          ></div>
        )}

        {/* navigation links */}
        <div className="flex items-center">
          {navItems.map((i: NavItemsTypes, index: number) => (
            <Link
              href={i.href}
              key={index}
              className="px-5 font-medium text-lg"
            >
              {i.title}
            </Link>
          ))}
        </div>

        <div>
          {isSticky && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
