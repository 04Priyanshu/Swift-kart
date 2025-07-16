import { Pencil, PlusIcon, WandSparkles, XIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react'

const ImagePlaceHolder = ({
    size,small,onImageChange,onRemove,defaultImage = null , index = null , setOpenImageModal
}:{
    size:string,
    small?:boolean,
    onImageChange:(file:File | null,index:number)=>void,
    onRemove?:(index:number)=>void,
    defaultImage:string | null,
    index?:any,
    setOpenImageModal:(openImageModal:boolean)=>void,
}) => {

const [imagePreview,setImagePreview] = useState<string | null>(defaultImage);

const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file){
        setImagePreview(URL.createObjectURL(file));
        onImageChange(file,index);
    }
}

  return (
    <div className={`relative ${small ? " h-[180px]" : "h-[450px]"} w-full cursor-pointer border border-gray-600 flex flex-col justify-center items-center bg-[#1e1e1e]`}>
        <input type="file" accept='image/*' className='hidden' id={`image-upload-${index}`} onChange={handleFileChange} />
        {imagePreview ? (
            <>
            <button type='button' onClick={()=>onRemove?.(index!)} className='absolute top-3 right-3 !rounded bg-red-500 shadow-lg'>
                <XIcon size={16} className='text-white' />
            </button>

            <button type='button' onClick={()=>setOpenImageModal(true)} className='absolute top-3 right-[70px] p-2 cursor-pointer !rounded bg-blue-500 shadow-lg'>
                <WandSparkles size={16} className='text-white' />
            </button>
            </>
        ) : (
            <label className='absolute top-3 right-3 p-2 cursor-pointer !rounded bg-slate-700 shadow-lg' htmlFor={`image-upload-${index}`}>
                <Pencil size={16} className='text-white' />
            </label>
        )}

        {imagePreview ? (
            <Image
            width={400}
            height={300}
            src={imagePreview}
            alt='uploaded'
            className='w-full h-full object-cover rounded-lg'
            />
        ):(
            <>
            <p className={`text-gray-400 ${small ? "text-xl" : "text-4xl"} font-semibold` }>
                {size}
                </p>

                <p className={`text-gray-500 ${small ? "text-sm" : "text-lg"} pt-2 text-center`}>
                    please choose an image <br />
                    according to the size
                </p>
            </>
        )}
    </div>
  )
}

export default ImagePlaceHolder