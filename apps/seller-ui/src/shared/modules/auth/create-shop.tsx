import { useMutation } from '@tanstack/react-query';
import { shopCategories } from 'apps/seller-ui/src/utils/categories';
import axios, { AxiosError } from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form';

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

const CreateShop = ({sellerId,setActiveStep}:{sellerId:string,setActiveStep:(step:number)=>void})  => {

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();

      const createShopMutation = useMutation({
        mutationFn: async (data:FormData) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-shop`,data);
            return response.data;
        },
        onSuccess:()=>{
            setActiveStep(3);
        }
      })

      const onSubmit = async (data:any)=>{
        const shopData = {
            ...data,
            sellerId
        }
        console.log('Creating shop with data:', shopData);
        createShopMutation.mutate(shopData);
      }

      const countWords = (text:string)=> text.trim().split(/\s+/).length;
      
  return (
    <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className='text-2xl font-semibold text-center mb-4'>Create Shop</h3>

            <label className='block text-gray-700 mb-1'> Name*</label>
            <input type="text" placeholder='Enter Shop Name' {...register("name")} className='w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1' />
            {errors.name && <p className='text-red-500'>{errors.name.message?.toString()}</p>}

            <label className='block text-gray-700 mb-1'> Bio (max 100 words)</label>
            <input type="text" placeholder='Enter Shop Bio' {...register("bio",{required:"Bio is required",validate:(value)=>countWords(value) <= 100 || "Bio must be less than 100 words"})} className='w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1' />
            {errors.bio && <p className='text-red-500'>{errors.bio.message?.toString()}</p>}

            <label className='block text-gray-700 mb-1'> Address</label>
            <input type="text" placeholder='Enter Shop Address' {...register("address",{required:"Address is required"})} className='w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1' />
            {errors.address && <p className='text-red-500'>{errors.address.message?.toString()}</p>}

            <label className='block text-gray-700 mb-1'> Opening Hours</label>
            <input type="text" placeholder='Enter Shop Opening Hours' {...register("opening_hours",{required:"Opening Hours is required"})} className='w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1' />
            {errors.opening_hours && <p className='text-red-500'>{errors.opening_hours.message?.toString()}</p>}

            <label className='block text-gray-700 mb-1'> Website</label>
            <input type="text" placeholder='Enter Shop Website' {...register("website",{pattern:{value:/^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/, message:"Enter a valid website"}})} className='w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1' />
            {errors.website && <p className='text-red-500'>{errors.website.message?.toString()}</p>}

            <label className='block text-gray-700 mb-1'> Category</label>
            <select {...register("category",{required:"Category is required"})} className='w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1'>
                {shopCategories.map((category)=>(
                    <option key={category.value} value={category.value}>{category.label}</option>
                ))}
            </select>
            {errors.category && <p className='text-red-500'>{errors.category.message?.toString()}</p>}

            <button
                disabled={createShopMutation.isPending}
                type="submit"
                className={`w-full mt-4 text-lg cursor-pointer p-2 rounded-md transition-all duration-200 ${
                  createShopMutation.isPending
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {createShopMutation.isPending ? <RectangularLoader /> : "Create Shop"}
              </button>

              {createShopMutation.isError && 
              createShopMutation.error instanceof AxiosError && (
                <p className="text-red-500">
                  {(createShopMutation.error.response?.data as {message: string})?.message || createShopMutation.error.message}
                </p>
              )
              }
        </form>
    </div>
  )
}

export default CreateShop