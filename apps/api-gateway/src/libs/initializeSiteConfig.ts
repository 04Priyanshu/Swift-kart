import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const initializeSiteConfig = async () => {
   try {
    const existingConfig = await prisma.siteConfig.findFirst();

    if(!existingConfig){
        await prisma.siteConfig.create({
            data:{
                categories:[
                    "Electronics",
                    "Clothing",
                    "Home & Kitchen",
                    "Sports & Fitness",
                ],
                subCategories:{
                    "Electronics":[
                        "Mobile Phones",
                        "Laptops",
                        "Tablets",
                        "Smart Home",
                        "Gaming",
                    ],
                    "Clothing":[
                        "Men's Clothing",
                        "Women's Clothing",
                        "Kids' Clothing",
                        "Shoes",
                        "Accessories",
                    ],
                    "Home & Kitchen":[
                        "Furniture",
                        "Appliances",
                        "Kitchenware",
                        "Home Decor",
                    ],
                    "Sports & Fitness":[
                        "Fitness Equipment",
                        "Sports Equipment",
                        "Outdoor Gear",
                        "Team Sports",
                    ],
                }
            }
        })
    }
   } catch (error) {
    console.error("Error initializing site config:", error);
   }
}