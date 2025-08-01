import express from "express";
import { createShop, createStripeConnectLink, forgotPassword, getLoggedInSellerDetails, getUserDetails, login, loginSeller, refreshToken, registerSeller, resetUserPassword, userRegistration, verifySeller, verifyUser, verifyUserForgotPasswordOtp } from "../controller/auth.controller";
import isAuthenticated from "@packages/middleware/isAuthenticated";
import { isSeller } from "@packages/middleware/authorizeRoles";

const router = express.Router();

router.post("/user-registration" , userRegistration);
router.post("/verify-user" , verifyUser);
router.post("/login-user" , login);
router.post("/forgot-password-user" , forgotPassword);
router.post("/refresh-token" , refreshToken);
router.post("/verify-forgot-password-user" , verifyUserForgotPasswordOtp);
router.post("/reset-user-password" , resetUserPassword);
router.get("/logged-in-user" , isAuthenticated, getUserDetails);
router.post("/seller-registration" , registerSeller);
router.post("/verify-seller" , verifySeller);
router.post("/create-shop" , createShop);
router.post("/create-stripe-link" , createStripeConnectLink);
router.post("/login-seller" , loginSeller);
router.get("/logged-in-seller" , isAuthenticated, isSeller, getLoggedInSellerDetails);

export default router;