import express from "express";
import { forgotPassword, login, resetUserPassword, userRegistration, verifyUser, verifyUserForgotPasswordOtp } from "../controller/auth.controller";

const router = express.Router();

router.post("/user-registration" , userRegistration);
router.post("/verify-user" , verifyUser);
router.post("/login-user" , login);
router.post("/forgot-password-user" , forgotPassword);
router.post("/verify-forgot-password-user" , verifyUserForgotPasswordOtp);
router.post("/reset-user-password" , resetUserPassword);

export default router;