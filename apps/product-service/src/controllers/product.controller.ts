import { ValidationError } from "@packages/error-handler";
import imagekit from "@packages/libs/imagekit";
import prisma from "@packages/libs/prisma";
import { log } from "console";
import { Request, Response, NextFunction } from "express";

//get product categories
export const getProductCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const config = await prisma.siteConfig.findFirst();
    if (!config) {
      return next(new Error("No categories found"));
    }
    res
      .status(200)
      .json({
        categories: config.categories,
        subCategories: config.subCategories,
      });
  } catch (error) {
    return next(error);
  }
};

//create discount code
export const createDiscountCode = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { public_name, discountCode, discountValue, discountType } = req.body;
    const isDiscountCodeExists = await prisma.discountCodes.findUnique({
      where: {
        discountCode: discountCode,
      },
    });
    if (isDiscountCodeExists) {
      return next(new Error("Discount code already exists"));
    }
    const discount_code = await prisma.discountCodes.create({
      data: {
        public_name,
        discountCode,
        discountValue: parseFloat(discountValue),
        discountType,
        sellerId: req.seller.id,
      },
    });
    res
      .status(201)
      .json({ message: "Discount code created successfully", discount_code });
  } catch (error) {
    return next(error);
  }
};

export const getDiscountCodes = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const discountCode = await prisma.discountCodes.findMany({
      where: {
        sellerId: req.seller.id,
      },
    });
    res.status(200).json({ discountCode });
  } catch (error) {
    return next(error);
  }
};

//delete discount code
export const deleteDiscountCode = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const sellerId = req.seller.id;
    const discountCode = await prisma.discountCodes.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        sellerId: true,
      },
    });
    if (!discountCode) {
      return next(new Error("Discount code not found"));
    }
    if (discountCode.sellerId !== sellerId) {
      return next(
        new Error("You are not authorized to delete this discount code")
      );
    }

    await prisma.discountCodes.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ message: "Discount code deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

//upload product image
export const uploadProductImage = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileName } = req.body;

    const response = await imagekit.upload({
      file: fileName,
      fileName: `product-${Date.now()}.jpg`,
      folder: "/products",
    });
    res.status(200).json({ file_url: response.url, fileId: response.fileId });
  } catch (error) {
    next(error);
  }
};

//delete product image
export const deleteProductImage = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileId } = req.body;

    const response = await imagekit.deleteFile(fileId);
    res
      .status(200)
      .json({ message: "Image deleted successfully", success: true });
  } catch (error) {
    next(error);
  }
};

//create product
export const createProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      short_description,
      detailed_description,
      warranty,
      custom_specification,
      slug,
      tags,
      cash_on_delivery,
      brand,
      video_url,
      category,
      colors = [],
      sizes = [],
      discountCodes,
      stock,
      sale_price,
      regular_price,
      subCategory,
      customProperties = {},
      images = [],
    } = req.body;



    if (
      !title ||
      !short_description ||
      !slug ||
      !category ||
      !stock ||
      !tags ||
      !sale_price ||
      !regular_price ||
      !subCategory ||
      !images
    ) {
      return next(new ValidationError("All fields are required"));
    }


    

    if (!req.seller.id) {
      return next(new Error("You are not authorized to create a product"));
    }

    const slugChecking = await prisma.products.findUnique({
      where: {
        slug,
      },
    });

    if (slugChecking) {
      return next(new ValidationError("Slug already exists"));
    }

    const product = await prisma.products.create({
      data: {
        title,
        short_description,
        detailed_description,
        warranty,
        cashOnDelivery: cash_on_delivery,
        slug,
        //shopId: req.seller?.shop?.id!,
        tags: Array.isArray(tags) ? tags : tags.split(","),
        brand,
        video_url,
        category,
        subCategory,
        colors: colors || [],
        discount_codes: discountCodes.map((codeId: any) => codeId),
        sizes: sizes || [],
        stock: parseInt(stock),
        sale_price: parseFloat(sale_price),
        regular_price: parseFloat(regular_price),
        custom_properties: customProperties || {},
        custom_specification: custom_specification || {},
        images: {
          create: images
            .filter((image: any) => image && image.fileId && image.file_url)
            .map((image: any) => ({
              file_id: image.fileId,
              url: image.file_url,
            })),
        },
        shop:{
            connect:{
                id:req.seller.shop.id
            }
        }
      },
      include: { images: true },
    });
    res
      .status(201)
      .json({
        message: "Product created successfully",
        product,
        success: true,
      });
  } catch (error) {
    return next(error);
  }
};

//get all products
export const getAllProducts = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.products.findMany({
      where: {
        shopId: req?.seller?.shop?.id,
      },
      include: {
        images: true,
      },
    });
    res
      .status(200)
      .json({
        products,
        success: true,
        message: "Products fetched successfully",
      });
  } catch (error) {
    return next(error);
  }
};
