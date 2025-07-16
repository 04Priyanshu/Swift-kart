import { Router } from "express";
import { getProductCategories } from "../controllers/product.controller";

const router = Router();

router.get("/get-categories", getProductCategories);

export default router;