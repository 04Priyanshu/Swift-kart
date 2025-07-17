import prisma from "@packages/libs/prisma";
import { Request, Response , NextFunction } from "express";


//get product categories
export const getProductCategories = async (req:Request, res:Response , next:NextFunction) => {
    try {
        const config = await prisma.siteConfig.findFirst();
        if(!config){
            return next(new Error("No categories found"));
        }
        res.status(200).json({categories:config.categories , subCategories:config.subCategories});
    } catch (error) {
        return next(error);
    }
}


//create discount code
export const createDiscountCode = async (req:any, res:Response , next:NextFunction) => {
    try {
        const {public_name, discountCode, discountValue, discountType} = req.body;
        const isDiscountCodeExists = await prisma.discountCodes.findUnique({
            where:{
                discountCode:discountCode
            }
        })
        if(isDiscountCodeExists){
            return next(new Error("Discount code already exists"));
        }
        const discount_code = await prisma.discountCodes.create({
            data:{
                public_name,
                discountCode,
                discountValue:parseFloat(discountValue),
                discountType,
                sellerId:req.seller.id
            }
        })
        res.status(201).json({message:"Discount code created successfully", discount_code});
    } catch (error) {
        return next(error);
    }
}

export const getDiscountCodes = async (req:any, res:Response , next:NextFunction) => {
    try {
        const discountCode = await prisma.discountCodes.findMany({
            where:{
                sellerId:req.seller.id
            }
        })
        res.status(200).json({discountCode});
    } catch (error) {
        return next(error);
    }
}


//delete discount code
export const deleteDiscountCode = async (req:any, res:Response , next:NextFunction) => {
    try {
        const {id} = req.params;
        const sellerId = req.seller.id;
        const discountCode = await prisma.discountCodes.findUnique({
            where:{
                id,
            },
            select:{
                id:true,
                sellerId:true
            }
        })
        if(!discountCode){
            return next(new Error("Discount code not found"));
        }
        if(discountCode.sellerId !== sellerId){
            return next(new Error("You are not authorized to delete this discount code"));
        }

        await prisma.discountCodes.delete({
            where:{
                id
            }
        })
        res.status(200).json({message:"Discount code deleted successfully"});
    } catch (error) {
        return next(error);
    }
}


