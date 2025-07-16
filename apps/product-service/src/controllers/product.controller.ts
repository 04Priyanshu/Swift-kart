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