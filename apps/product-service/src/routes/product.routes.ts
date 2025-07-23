import { Router } from "express";
import { createDiscountCode, createProduct, deleteDiscountCode, deleteProduct, deleteProductImage, getAllProducts, getAllSellerProducts, getDiscountCodes, getProductCategories, getSellerStripeAccount, restoreProduct, uploadProductImage } from "../controllers/product.controller";
import isAuthenticated from "@packages/middleware/isAuthenticated";

const router = Router();

router.get("/get-categories", getProductCategories);
router.post("/create-discount-code", isAuthenticated, createDiscountCode);
router.get("/get-discount-codes", isAuthenticated, getDiscountCodes);
router.delete("/delete-discount-code/:id", isAuthenticated, deleteDiscountCode);
router.post("/upload-product-image", isAuthenticated, uploadProductImage);
router.delete("/delete-product-image", isAuthenticated, deleteProductImage);
router.post("/create-product", isAuthenticated, createProduct);
router.get("/get-shop-products", isAuthenticated, getAllSellerProducts);
router.delete("/delete-product/:productId", isAuthenticated, deleteProduct);
router.put("/restore-product/:productId", isAuthenticated, restoreProduct);
router.get("/get-seller-stripe-account", isAuthenticated, getSellerStripeAccount);
router.get("/get-all-products", getAllProducts);

export default router;