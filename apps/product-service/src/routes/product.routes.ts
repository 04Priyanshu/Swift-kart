import { Router } from "express";
import { createDiscountCode, createProduct, deleteDiscountCode, deleteProductImage, getAllProducts, getDiscountCodes, getProductCategories, uploadProductImage } from "../controllers/product.controller";
import isAuthenticated from "@packages/middleware/isAuthenticated";

const router = Router();

router.get("/get-categories", getProductCategories);
router.post("/create-discount-code", isAuthenticated, createDiscountCode);
router.get("/get-discount-codes", isAuthenticated, getDiscountCodes);
router.delete("/delete-discount-code/:id", isAuthenticated, deleteDiscountCode);
router.post("/upload-product-image", isAuthenticated, uploadProductImage);
router.delete("/delete-product-image", isAuthenticated, deleteProductImage);
router.post("/create-product", isAuthenticated, createProduct);
router.get("/get-all-products", isAuthenticated, getAllProducts);

export default router;