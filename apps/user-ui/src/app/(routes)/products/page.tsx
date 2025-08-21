   "use client"
   import React, { useEffect, useState } from 'react'
   import { useQuery } from '@tanstack/react-query'
import axiosInstance from 'apps/user-ui/src/utils/axiosinstance'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {Range} from "react-range"
import { P } from 'node_modules/framer-motion/dist/types.d-Bq-Qm38R'
import ProductCard from 'apps/user-ui/src/shared/components/Cards/product-card'

const MIN=0;
const MAX=1199;


   const page = () => {
    const router = useRouter()
    const [isProductLoading,setIsProductLoading] = useState(false)
    const[priceRange,setPriceRange] = useState([0,1199])
    const [selectCategories,setSelectCategories] = useState<string[]>([])
    const [selectColors,setSelectColors] = useState<string[]>([])
    const [selectSizes,setSelectSizes] = useState<string[]>([])
    const [page,setPage] = useState(1)
    const [totalPages,setTotalPages] = useState(1)
    const [products,setProducts] = useState<any[]>([])
    const [tempPriceRange,setTempPriceRange] = useState([0,1199])

    const colors = [
        {name:"Black",value:"#000000"},
        {name:"White",value:"#ffffff"},
        {name:"Red",value:"#ff0000"},
        {name:"Green",value:"#00ff00"},
        {name:"Blue",value:"#0000ff"},
        {name:"Yellow",value:"#ffff00"},
        {name:"Purple",value:"#ff00ff"},
    ]

    const sizes = ["S","M","L","XL","XXL","XXXL"]

    const handleColorChange = (color:string)=>{
        setSelectColors((prev)=>{
            if(prev.includes(color)){
                return prev.filter((c:string)=>c !== color)
            }else{
                return [...prev,color]
            }
        })
    }

    const handleSizeChange = (size:string)=>{

        setSelectSizes((prev)=>{
            if(prev.includes(size)){
                return prev.filter((s:string)=>s !== size)
            }else{
                return [...prev,size]
            }
        })
    }

    const updateUrl = ()=>{
        const query = new URLSearchParams()
        query.set("priceRange",priceRange.join("-"))
        if(selectCategories.length > 0){
            query.set("categories",selectCategories.join(","))
        }
        if(selectColors.length > 0){
            query.set("colors",selectColors.join(","))
        }
        if(selectSizes.length > 0){
            query.set("sizes",selectSizes.join(","))
        }
        query.set("page",page.toString())
        router.replace(`/products?${decodeURIComponent(query.toString())}`)
    }

    const handleCategoryChange = (category:string)=>{
       setSelectCategories((prev)=>{
        if(prev.includes(category)){
            return prev.filter((c:string)=>c !== category)
        }else{
            return [...prev,category]
        }
       })
    }

    const fetchFilteredProducts = async()=>{
        setIsProductLoading(true)
        try {
            const query = new URLSearchParams()
            query.set("priceRange",priceRange.join("-"))
            if(selectCategories.length > 0){
                query.set("categories",selectCategories.join(","))
            }
            if(selectColors.length > 0){
                query.set("colors",selectColors.join(","))
            }
            if(selectSizes.length > 0){
                query.set("sizes",selectSizes.join(","))
            }
            query.set("page",page.toString())
            query.set("limit","12")
            const response = await axiosInstance.get(`/product/api/get-filtered-products?${query.toString()}`)
            setProducts(response.data.products)
            setTotalPages(response.data.pagination.totalPages)
            setIsProductLoading(false)
        } catch (error) {
            console.log("error in fetchFilteredProducts",error)
        }finally{
            setIsProductLoading(false)
        }
    }

    const {data,isLoading} = useQuery({
        queryKey:["categories"],
        queryFn: async()=>{
            const response = await axiosInstance.get("/product/api/get-categories")
            return response.data
        },
        staleTime:1000*60*30,
    })

    useEffect(()=>{
        updateUrl()
        fetchFilteredProducts()
    },[page,priceRange,selectCategories,selectColors,selectSizes])

     return (
       <div className='bg-[#f5f5f5] w-full pb-10'>
        <div className='lg:w-[80%] w-[90%] m-auto'>
            <div className='pb-[50px]'>
                <h1 className='md:pt-[40px] font-medium text-[44px] leading-[1] mb-[14px] font-jost '>
                    All Products
                </h1>
                <Link href='/' className='text-[#55585b] hover:underline'>
                    Home
                </Link>
                <span className='mx-2'>
                    /
                </span>
                <span className='text-[#55585b]'>All Products</span>
            </div>

            <div className='w-full flex flex-col lg:flex-row gap-8'>
                {/* sidebar */}
                <aside className='w-full lg:w-[270px] !rounded bg-white p-4 space-y-6 shadow-md'>
                    <h3 className='text-xl font-medium font-Poppins'>Price Filter</h3>
                    <div className='ml-2'>
                        <Range
                        step={1}
                        min={MIN}
                        max={MAX}
                        values={tempPriceRange}
                        onChange={(values)=>setTempPriceRange(values)}
                        renderTrack={({props,children})=>{
                            const [min,max] = tempPriceRange;
                            const percentageLeft = ((min-MIN)/(MAX-MIN))*100;
                            const percentageRight = ((max-MIN)/(MAX-MIN))*100;
                            return (
                                <div 
                                    className='h-[6px] bg-gray-200 rounded relative' 
                                    {...props} 
                                    style={{
                                        ...props.style,
                                        height: '6px',
                                        width: '100%',
                                        backgroundColor: '#e5e7eb'
                                    }}
                                >
                                    <div 
                                        className='absolute h-full bg-blue-600 rounded' 
                                        style={{
                                            left: `${percentageLeft}%`,
                                            width: `${percentageRight-percentageLeft}%`,
                                            height: '100%',
                                            backgroundColor: '#2563eb'
                                        }}
                                    />
                                    {children}
                                </div>
                            );
                        }}
                        renderThumb={({props, index})=>{
                            const {key, ...rest} = props;
                            return (
                                <div 
                                    className='w-[20px] h-[20px] bg-blue-600 rounded-full shadow-lg border-2 border-white cursor-pointer' 
                                    key={key} 
                                    {...rest}
                                    style={{
                                        ...rest.style,
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: '#2563eb',
                                        border: '2px solid white',
                                        borderRadius: '50%',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        cursor: 'grab'
                                    }}
                                />
                            );
                        }}
                        />
                    </div>
                    <div className='flex justify-between items-center mt-2'>
                       <div className='text-sm text-gray-600'>
                        ${tempPriceRange[0]} - ${tempPriceRange[1]}
                       </div>
                       
                       <button className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors' onClick={()=>setPriceRange(tempPriceRange)}>
                        Apply Filter
                       </button>
                    </div>


                    {/* category filter */}
                    <h3 className='text-xl font-medium border-b border-b-slate-300 font-Poppins'>Category Filter</h3>
                    <ul className='space-y-2 !mt-3'>
                        {isLoading ? (
                        <p>Loading...</p>
                        ):(
                            data?.categories?.map((category:any)=>(
                                <li key={category} className='flex items-center justify-between'>
                                    <label className='flex items-center gap-3 text-sm text-gray-700'>
                                        <input type='checkbox' className='accent-blue-600' checked={selectCategories.includes(category)} onChange={()=>handleCategoryChange(category)} />
                                        <span className='text-sm text-gray-600'>{category}</span>
                                    </label>
                                </li>
                            ))
                        )}

                    </ul>

                    {/* color filter */}
                    <h3 className='text-xl font-medium border-b border-b-slate-300 font-Poppins'>Color Filter</h3>
                    <ul className='space-y-2 !mt-3'>
                        {
                            colors?.map((color:any)=>(
                                <li key={color.value} className='flex items-center justify-between'>
                                    <label className='flex items-center gap-3 text-sm text-gray-700'>
                                        <input type='checkbox' className='accent-blue-600' checked={selectColors.includes(color.name)} onChange={()=>handleColorChange(color.name)} />
                                        <span className='text-sm text-gray-600' >{color.name}</span>
                                    </label>
                                </li>
                            ))
                        }
                    </ul>

                    {/* size filter */}
                    <h3 className='text-xl font-medium border-b border-b-slate-300 font-Poppins'>Size Filter</h3>
                    <ul className='space-y-2 !mt-3'>
                        {sizes.map((size)=>(
                            <li key={size} className='flex items-center justify-between'>
                                <label className='flex items-center gap-3 text-sm text-gray-700'>
                                    <input type='checkbox' className='accent-blue-600' checked={selectSizes.includes(size)} onChange={()=>handleSizeChange(size)} />
                                    <span className='text-sm text-gray-600'>{size}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* products */}
                <div className='flex-1 px-2 lg:px-3'>
                    {
                        isProductLoading ? (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                                {
                                    Array.from({length: 10}).map((_,index) => (
                                        <div key={index} className='bg-gray-300 h-[250px] animate-pulse rounded-xl'></div>
                                    ))
                                }
                            </div>
                        ) :products.length > 0 ? (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                                {
                                    products.map((product:any)=>(
                                        <ProductCard key={product.id} product={product} />
                                    ))
                                }
                            </div>
                        ) : (
                            <div className='text-center text-gray-500 py-10'>
                                <p>No products found</p>
                            </div>
                        )
                    }

                    {/* pagination */}
                    {
                        totalPages > 1 && (
                            <div className='flex justify-center items-center mt-8 gap-2'>
                                {
                                    Array.from({length: totalPages}).map((_,index)=>(
                                        <button key={index+1} className={`px-4 py-2 rounded-md ${page === index+1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`} onClick={()=>setPage(index+1)}>
                                            {index+1}
                                        </button>
                                    ))
                                }
                            </div>
                        )
                    }

                </div>
            </div>
        </div>
       </div>
     )
   }
   
   export default page