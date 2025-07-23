"use client"
import React from "react";
import Hero from "../shared/modules/hero";
import SectionTitle from "../shared/components/section/section-title";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosinstance";
import ProductCard from "../shared/components/Cards/product-card";

const page = () => {
  const {data:products,isLoading,isError} = useQuery({
    queryKey:["products"],
    queryFn:async()=>{
      const response = await axiosInstance.get("/product/api/get-all-products?page=1&limit=10")
      return response.data.products
    },
    staleTime:1000*60*2,
  })

  const {data:latestProducts} = useQuery({
    queryKey:["latestProducts"],
    queryFn:async()=>{
      const response = await axiosInstance.get("/product/api/get-all-products?page=1&limit=10&type=latest")
      return response.data.products
    },
    staleTime:1000*60*2,
  })
  return (
    <div className="bg-[#f5f5f5]">
      <Hero />
      <div className="md:w-[80%] w-[90%] m-auto my-10">
        <div className="mb-8">
          <SectionTitle title="Featured Products" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-3 2xl:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-300 h-[250px] animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid m-auto grid-cols-1 md:grid-cols-4 sm:grid-cols-3 2xl:grid-cols-5 gap-5">
            {products?.map((product:any)=>(
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
