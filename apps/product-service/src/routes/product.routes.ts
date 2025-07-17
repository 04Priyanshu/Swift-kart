import { Router } from "express";
import { createDiscountCode, deleteDiscountCode, getDiscountCodes, getProductCategories } from "../controllers/product.controller";
import isAuthenticated from "@packages/middleware/isAuthenticated";

const router = Router();

router.get("/get-categories", getProductCategories);
router.post("/create-discount-code", isAuthenticated, createDiscountCode);
router.get("/get-discount-codes", isAuthenticated, getDiscountCodes);
router.delete("/delete-discount-code/:id", isAuthenticated, deleteDiscountCode);

export default router;