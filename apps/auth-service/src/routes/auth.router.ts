import express from "express";
import { forgotPassword, getUserDetails, login, refreshToken, resetUserPassword, userRegistration, verifyUser, verifyUserForgotPasswordOtp } from "../controller/auth.controller";
import isAuthenticated from "@packages/middleware/isAuthenticated";

const router = express.Router();

router.post("/user-registration" , userRegistration);
router.post("/verify-user" , verifyUser);
router.post("/login-user" , login);
router.post("/forgot-password-user" , forgotPassword);
router.post("/refresh-token-user" , refreshToken);
router.post("/verify-forgot-password-user" , verifyUserForgotPasswordOtp);
router.post("/reset-user-password" , resetUserPassword);
router.get("/logged-in-user" , isAuthenticated, getUserDetails);

export default router;