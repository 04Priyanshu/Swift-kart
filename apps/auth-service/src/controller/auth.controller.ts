import { NextFunction, Request, Response } from "express";
import {
  checkOtpRestriction,
  handleForgotPassword,
  sendOtp,
  verifyForgotPasswordOtp,
  trackOtpRequest,
  validateRegistrationData,
  verifyOtp,
} from "../utils/auth.helper";
import { AuthenticationError, ValidationError } from "@packages/error-handler";
import prisma from "@packages/libs/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookies } from "../utils/cookies/set-cookies";

//Register
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, "user");
    const { name, email } = req.body;

    const existingUser = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return next(new ValidationError("user already exists with this email"));
    }

    await checkOtpRestriction(email, next);
    await trackOtpRequest(email, next);
    await sendOtp(email, "user-activation-mail", name);

    res.status(200).json({
      message: "OTP sent to your email",
    });
  } catch (error) {
    return next(error);
  }
};

//verify user
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp ,password , name } = req.body;
    if(!email || !otp || !password || !name) {
      return next(new ValidationError("all fields are required"));
    }
    const existingUser = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if(existingUser) {
      return next(new ValidationError("user already exists with this email"));
    }
    //verify otp
    await verifyOtp(email , otp , next);
    const hashedPassword = await bcrypt.hash(password , 10);
    //create user
     await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    return next(error);
  }
}

//login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) {
      return next(new ValidationError("all fields are required"));
    }
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if(!user) {
      return next(new AuthenticationError("user not found!!"));
    }

    //check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password!);//here password is optional so we use ! to tell typescript that it is not null
    if(!isPasswordCorrect) {
      return next(new AuthenticationError("invalid email or password"));
    }

    //generate token and refresh token
    const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_JWT_SECRET as string, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_JWT_SECRET as string, { expiresIn: "7d" });
    setCookies(res, "refresh_token", refreshToken);
    setCookies(res, "access_token", accessToken);

    //send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return next(error);
  }
}

//forgot password
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await handleForgotPassword(req, res, next,'user');
  }catch(error) {
    return next(error);
  }
}

//verify forgot password otp
export const verifyUserForgotPasswordOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
   await verifyForgotPasswordOtp(req, res, next);
  }catch(error) {
    return next(error);
  }
}
//reset password
export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newPassword  } = req.body;
    if(!email || !newPassword) {
      return next(new ValidationError("all fields are required"));
    }
    //check if user exists
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if(!user) {
      return next(new ValidationError("user not found"));
    }
    //check if new password is same as old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password!);
    if(isSamePassword) {
      return next(new ValidationError("new password cannot be same as old password"));
    }
    //update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { email: email },
      data: { password: hashedPassword },
    });
    //send response
    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  }catch(error) {
    return next(error);
  }
}