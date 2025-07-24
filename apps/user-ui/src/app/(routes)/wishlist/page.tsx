"use client"
import useLocation from 'apps/user-ui/src/hooks/useLocation';
import useDeviceTracking from 'apps/user-ui/src/hooks/useDeviceTracking';
import useUser from 'apps/user-ui/src/hooks/useUser';
import { useStore } from 'apps/user-ui/src/store';
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';

const WishlistPage = () => {

    const {user} = useUser();
    const wishlist = useStore((state : any)=>state.wishlist);
    const location = useLocation();
    const deviceInfo = useDeviceTracking();
    const addToCart = useStore((state : any)=>state.addToCart);
    const removeFromWishlist = useStore((state : any)=>state.removeFromWishlist);

    const decreaseQuantity = (id : string)=>{
        useStore.setState((state : any)=>({
            wishlist : state.wishlist.map((item : any)=>item.id === id && item.quantity > 1 ? {...item, quantity : item.quantity - 1} : item)
        }))
    }

    const increaseQuantity = (id : string)=>{
        useStore.setState((state : any)=>({
            wishlist : state.wishlist.map((item : any)=>item.id === id  ? {...item, quantity : (item.quantity ?? 1) + 1} : item)
        }))
    }
    const removeItem = (id : string)=>{
        removeFromWishlist(id,user,location,deviceInfo);
    }



  return (
    <div className='w-full bg-white'>
        <div className='md:w-[80%] w-[95%] mx-auto min-h-screen'>

            {/* breadcrumbs */}
            <div className='pb-[50px]'>
                <h1 className='md-pt-[50px] mb-[16px] font-medium font-jost text-[44px] leading-[1] '>
                    Wishlist
                </h1>
                <Link href="/" className='text-[#55585b] hover:underline'>Home</Link>
                <span className='inline-block p-[1.5px] mx-1 bg-transparent rounded-full '>.</span>
                <span className=' text-[#55585b]'>Wishlist</span>
            </div>

            {/* wishlist items */}
            {
                wishlist.length === 0 ? (
                    <div className='text-center text-gray-600 text-lg'>
                        Your wishlist is empty!! Start adding products to your wishlist.
                    </div>
                ):(
                    <div className='flex flex-col gap-10'>
                        <table className='w-full border-collapse'>
                            <thead className='bg-[#f1f3f4]'>
                                <tr>
                                    <th className='text-left py-3 pl-4'>Product</th>
                                    <th className='text-left py-3'>Price</th>
                                    <th className='text-left py-3'>Quantity</th>
                                    <th className='text-left py-3'>Action</th>
                                    <th className='text-left py-3'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    wishlist.map((item : any)=>(
                                        <tr key={item.id} className='border-b border-b-[#0000000e]'>
                                            <td className='flex items-center gap-3 p-4'>
                                                <Image
                                                src={item.images[0]?.url}
                                                alt={item.title}
                                                width={80}
                                                height={80}
                                                className='rounded'
                                                />
                                                <span>{item.title}</span>
                                            </td>

                                            <td className='px-6 text-lg'>
                                                ${item?.sale_price.toFixed(2)}
                                            </td>

                                            <td>
                                                <div className='flex items-center justify-center bg-gray-200 rounded-[20px] w-[90px] p-[2px] '>
                                                    <button onClick={()=>decreaseQuantity(item.id)} className='text-black cursor-pointer text-xl'>
                                                        -
                                                    </button>
                                                    <span className='px-4'>{item.quantity}</span>
                                                    <button onClick={()=>increaseQuantity(item.id)} className='text-black cursor-pointer text-xl'>
                                                        +
                                                    </button>
                                                </div>
                                            </td>

                                            <td>
                                                <button onClick={()=>addToCart(item,user,location,deviceInfo)} className='bg-[#02080d] cursor-pointer text-white px-5 py-2 rounded-md hover:bg-[#1e2936] hover:scale-105 transition-all'>
                                                    Add to Cart
                                                </button>
                                            </td>

                                            <td>
                                                <button onClick={()=>removeItem(item.id)} className='hover:text-red-500 text-[#55585b] cursor-pointer text-xl flex items-center gap-2'>
                                                    <span className='text-lg'>
                                                        <Trash2 size={20} />
                                                    </span>
                                                    <span>Remove</span>
                                                </button>
                                            </td>
                                            
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                )
            }

        </div>
    </div>
  )
}

export default WishlistPage