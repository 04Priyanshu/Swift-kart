import ProductDetails from 'apps/user-ui/src/shared/modules/product/product-details'
import axiosInstance from 'apps/user-ui/src/utils/axiosinstance'
import { Metadata } from 'next'
import React from 'react'


async function fetchProductDetails(slug:string){
    const response = await axiosInstance.get(`/product/api/get-product/${slug}`)
    return response.data.product
}

//for seo
export async function generateMetadata({params}:{params:{slug:string}}):Promise<Metadata>{
    const productDetails = await fetchProductDetails(params?.slug)
    return {
        title: `${productDetails?.title} | swiftkart`,
        description:productDetails?.short_description || "Swiftkart is a platform for buying and selling products",
        openGraph:{
            title:productDetails?.title,
            description:productDetails?.short_description || "Swiftkart is a platform for buying and selling products",
            images:[productDetails?.images[0]?.url || ""],
            type:"website",
        },
        twitter:{
            card:"summary_large_image",
            title:productDetails?.title,
            description:productDetails?.short_description || "Swiftkart is a platform for buying and selling products",
            images:[productDetails?.images[0]?.url || ""],
        },
    }
}

const page = async ({params}:{params:{slug:string}}) => {
    const productDetails = await fetchProductDetails(params?.slug)


  return (
    <ProductDetails productDetails={productDetails} />
  )
}

export default page