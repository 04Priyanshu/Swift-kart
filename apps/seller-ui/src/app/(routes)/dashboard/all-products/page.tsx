"use client"
import React, { useMemo, useState } from 'react'
import{
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    flexRender,
} from "@tanstack/react-table"
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { BarChart, ChevronRight, Eye, Pencil, Plus, Search, Star, Trash } from 'lucide-react'
import DeleteConfirmationModal from 'apps/seller-ui/src/shared/components/modals/delete.conformation.modal'


const fetchProducts = async () => {
    const response = await axiosInstance.get("/product/api/get-all-products");
    return response?.data?.products;
}

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


const ProductList = () => {

    const [globalFilter,setGlobalFilter] = useState("");
    const [analyticsData,setAnalyticsData] = useState(null);
    const [showAnalytics,setShowAnalytics] = useState(false);
    const [showDeleteModal,setShowDeleteModal] = useState(false);
    const [selectedProduct,setSelectedProduct] = useState<any>();
    const queryClient = useQueryClient();


    const {data:products=[],isLoading} = useQuery({
        queryKey:["shop-products"],
        queryFn:fetchProducts,
        staleTime:1000*60*5,
    })


    const deleteMutation = useMutation({
        mutationFn:async (productId:string) => {
            const response = await axiosInstance.delete(`/product/api/delete-product/${productId}`);
            return response?.data;
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["shop-products"]});
            setShowDeleteModal(false);
        }
        
    })

    const restoreMutation = useMutation({

        mutationFn:async (productId:string) => {
            const response = await axiosInstance.put(`/product/api/restore-product/${productId}`);
            return response?.data;
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["shop-products"]});
            setShowDeleteModal(false);
        }
        
    })

const columns = useMemo(
  () => [
    {
      header:"Image",
      accessorKey:"image",
      cell:({row} : any) => {
        console.log(row.original);
        
        return (
          <Image src={row.original.images[0].url} alt="row.original.images[0].url" width={200} height={200} className='w-12 h-12 rounded-md object-cover' />
        )
      }
    },
    {
      accessorKey:"name",
      header:"Product Name",
      cell:({row} : any) => {
        const truncatedTitle = row.original.title.length > 20 ? `${row.original.title.substring(0,20)}...` : row.original.title;
        return (
          <Link href={`${process.env.NEXT_PUBLIC_USER_UI}/product/${row.original.slug}`} className='text-green-500 hover:underline' title={row.original.title}>
            {truncatedTitle}
          </Link>
        )
      }
      
    },
    {
      accessorKey:"price",
      header:"Price",
      cell:({row} : any) => (
        <span className='text-white'>{row.original.sale_price}</span>
      )
    },
    {
      accessorKey:"stock",
      header:"Stock",
      cell:({row} : any) => (
        <span className={`${row.original.stock < 10 ? "text-red-500" : "text-white"}`}>{row.original.stock} left</span>
      )
    },
    {
      accessorKey:"category",
      header:"Category",
      // cell:({row} : any) => (
      //   <span className='text-white'>{row.original.category}</span>
      // )
    },
    {
      accessorKey:"rating",
      header:"Rating",
      cell:({row} : any) => (
        <div className='flex items-center gap-1 text-yellow-400'>
          <Star fill="#fde047" size={18} />{ " "}
          <span className='text-white'>{row.original.rating || 5}</span>
        </div>
      )
    },
    {
      header:"Actions",
      cell:({row} : any) => (
        <div className='flex  gap-3'>
          <Link  href={`/products/${row.original.id}`} className='text-green-500 hover:text-green-700 cursor-pointer transition'>
          <Eye size={18}/>
          </Link>

          <Link href={`/products/edit/${row.original.id}`} className='text-yellow-400 hover:text-yellow-300 cursor-pointer transition'>
          <Pencil size={18}/>
          </Link>

          <button  className='text-green-400 hover:text-green-300 cursor-pointer transition'>
            <BarChart size={18}/>
          </button>

          <button onClick={()=>openDeleteModal(row.original)} className='text-red-400 hover:text-red-300 cursor-pointer transition'>
            <Trash size={18}/>
          </button>
          
        </div>
      )
    }
    
  ],
  []
);

const openDeleteModal = (product:any) => {
  setShowDeleteModal(true);
  setSelectedProduct(product);
}


const table = useReactTable({
  data:products,
  columns,
  getCoreRowModel:getCoreRowModel(),
  getFilteredRowModel:getFilteredRowModel(),
  globalFilterFn:"includesString",
  state:{
    globalFilter,
  },
  onGlobalFilterChange:setGlobalFilter,
 
})

  return (
    <div className='w-full min-h-screen p-8'>
      {/* headers */}
      <div className='flex justify-between items-center mb-1'>
        <h2 className='text-2xl font-semibold text-white'>All Products</h2>
        <Link href="/dashboard/create-product" className='bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center gap-2 '>
          <Plus size={18}/>
          Add Product
        </Link>
      </div>

      {/* breadcrumbs */}
      <div className='flex items-center gap-2 mb-4 text-white'>
        <Link href="/dashboard" className='text-green-500 hover:text-green-700 transition'>
          Dashboard
        </Link><ChevronRight size={20}/>
        <span className='text-gray-200'>All Products</span>
      </div>

      {/* search bar */}
      <div className='flex flex-1 items-center bg-gray-900 rounded-md p-2 mb-4'>
      <Search size={18} className='text-gray-400 mr-2'/>
      <input type="text" placeholder='Search products...' className='bg-transparent w-full outline-none text-white' value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)}/>
      </div>

      {/* Table */}
      <div className='overflow-x-auto bg-gray-900 rounded-lg p-4'> 
        {
          isLoading ? (
            <RectangularLoader />
          ):(
           <table className='w-full text-white'>
            <thead>
              {
                table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className='border-b border-gray-800'>
                    {
                      headerGroup.headers.map((header) => (
                        <th key={header.id} className='text-left p-3'>
                          {
                            header.isPlaceholder ? null : flexRender(header.column.columnDef.header,header.getContext())
                          }
                        </th>
                      ))
                    }
                  </tr>
                ))
              }
            </thead>
            <tbody>
              {
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className='border-b border-gray-800 hover:bg-gray-900 transition'>
                    {
                      row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className='p-3'>
                          {
                            flexRender(cell.column.columnDef.cell,cell.getContext())
                          }
                        </td>
                      ))
                    }
                  </tr>
                ))
              }
            </tbody>

           </table>
          )
        }

        {
          showDeleteModal && (
            <DeleteConfirmationModal
            product={selectedProduct}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => deleteMutation.mutate(selectedProduct.id)}
            onRestore={() => restoreMutation.mutate(selectedProduct.id)}
            isLoading={deleteMutation.isPending || restoreMutation.isPending}
            />
          )
        }
      </div>
</div>
  )
}

export default ProductList