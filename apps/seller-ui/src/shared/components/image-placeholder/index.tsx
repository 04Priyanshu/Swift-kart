import { Pencil, PlusIcon, WandSparkles, XIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react'

// Rectangular Box Animation Loader Component
const RectangularLoader = () => {
  return (
    <div className="flex justify-center items-center gap-1">
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className="w-2 h-4 bg-white rounded-sm animate-pulse"
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  );
};

const ImagePlaceHolder = ({
    size,small,onImageChange,onRemove,defaultImage = null , index = null , setOpenImageModal,setSelectedImage,images,removingImageIndex
}:{
    size:string,
    small?:boolean,
    onImageChange:(file:File | null,index:number)=>void,
    onRemove?:(index:number)=>void,
    defaultImage:string | null,
    index?:any,
    setOpenImageModal:(openImageModal:boolean)=>void,
    setSelectedImage:(e:string)=>void,
    images:any,
    removingImageIndex?:number | null
}) => {

const [imagePreview,setImagePreview] = useState<string | null>(defaultImage);

// Update local state when defaultImage prop changes
useEffect(() => {
    setImagePreview(defaultImage);
}, [defaultImage]);

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
            <button 
                type='button' 
                onClick={()=>onRemove?.(index!)} 
                disabled={removingImageIndex === index}
                className='absolute top-3 right-3 !rounded bg-red-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
            >
                <XIcon size={16} className='text-white' />
            </button>

            <button type='button' onClick={()=>{setOpenImageModal(true);setSelectedImage(images[index]?.file_url)}} className='absolute top-3 right-[70px] p-2 cursor-pointer !rounded bg-blue-500 shadow-lg'>
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
            width={small ? 180 : 450}
            height={small ? 180 : 450}
            src={imagePreview}
            alt='uploaded'
            className='w-full h-full object-cover rounded-lg'
            quality={100}
            unoptimized={imagePreview.startsWith('blob:')}
            placeholder="empty"
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