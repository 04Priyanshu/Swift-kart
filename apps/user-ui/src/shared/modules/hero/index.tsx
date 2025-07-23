"use client"
import { useRouter } from 'next/navigation'
import { MoveRight } from 'lucide-react'
import React from 'react'
import Image from 'next/image'

const Hero = () => {
    const router = useRouter();
  return (
    <div className='bg-gray-950 h-[85vh] flex flex-col justify-center w-full '>
        <div className='md:w-[80%] w-[90%] m-auto md:flex h-full items-center'>
            <div className='md:w-1/2'>
            <p className='font-Roboto text-white text-xl pb-2 font-normal'>
                Starting from 40$
            </p>

            <h1 className='font-Roboto text-white text-6xl font-extrabold pb-4'>
                The best watch <br />
                Collection 2025
            </h1>
            <p className='font-Oregano text-white pt-4 text-3xl font-bold'>
                Exclusive offer <span className='text-yellow-400'>10%</span> off
            </p>
            <br />
            <button onClick={()=>router.push("/products")} className='w-[140px] gap-2 font-semibold h-[40px hover:text-white hover:bg-black transition-all duration-300 bg-white text-black rounded-md flex items-center justify-center' >
                Shop Now<MoveRight/>
            </button>
            </div>

            <div className='md:w-1/2 flex justify-center'>
            <Image
            src={"/web_jasgOIapv-removebg-preview (1).png"}
            alt= "hero"
            width={800}
            height={800}
            />
            </div>

        </div>
        
    </div>
  )
}

export default Hero