"use client"
import React, { useState } from 'react'
import{
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    flexRender,
} from "@tanstack/react-table"
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'
import { useQueryClient } from '@tanstack/react-query'


const fetchProducts = async () => {
    const response = await axiosInstance.get("/product/api/get-all-products");
    return response?.data?.products;
}


const ProductList = () => {

    const [globalFilter,setGlobalFilter] = useState("");
    const [analyticsData,setAnalyticsData] = useState(null);
    const [showAnalytics,setShowAnalytics] = useState(false);
    const [showDeleteModal,setShowDeleteModal] = useState(false);
    const [selectedProduct,setSelectedProduct] = useState<any>();
    const queryClient = useQueryClient();


  return (
    <div>

    </div>
  )
}

export default ProductList