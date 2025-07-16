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
import { JsonWebTokenError } from "jsonwebtoken";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! ,{
  apiVersion: "2025-06-30.basil",
});

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
    const { email, otp, password, name } = req.body;
    if (!email || !otp || !password || !name) {
      return next(new ValidationError("all fields are required"));
    }
    const existingUser = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return next(new ValidationError("user already exists with this email"));
    }
    //verify otp first
    await verifyOtp(email, otp, next);

    //only create user after OTP verification is successful
    const hashedPassword = await bcrypt.hash(password, 10);
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
};

//login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ValidationError("all fields are required"));
    }
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return next(new AuthenticationError("user not found!!"));
    }

    //check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password!); //here password is optional so we use ! to tell typescript that it is not null
    if (!isPasswordCorrect) {
      return next(new AuthenticationError("invalid email or password"));
    }

    res.clearCookie("seller_access_token");
    res.clearCookie("seller_refresh_token"); 

    //generate token and refresh token
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_JWT_SECRET as string,
      { expiresIn: "7d" }
    );
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
};

//refresh token
export const refreshToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken =
    req.cookies["refresh_token"] ||
    req.cookies["seller_refresh_token"] ||
    req.headers.authorization?.split(" ")[1];

    if (!refreshToken) {
      return next(new ValidationError("refresh token is required"));
    }
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_JWT_SECRET as string
    ) as { id: string; role: string };
    if (!decoded || decoded.id || decoded.role) {
      return new JsonWebTokenError("Forbidden!! Invalid refresh token");
    }

    let account;
    if(decoded.role === "user") {
      account = await prisma.users.findUnique({
        where: {
          id: decoded.id,
        },
      });
    } else if(decoded.role === "seller") {
      account = await prisma.sellers.findUnique({
        where: {
          id: decoded.id,
        },
        include: {
          shop: true,
        },
      });

    } 

    

    //generate new access token
    const newaccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.ACCESS_JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    

    if(decoded.role === "user") {
      setCookies(res, "access_token", newaccessToken);
    } else if(decoded.role === "seller") {
      setCookies(res, "seller_access_token", newaccessToken);
    }

    req.role = decoded.role;

    //send response
    res.status(201).json({
      success: true,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    return next(error);
  }
};

//get user details
export const getUserDetails = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AuthenticationError("user not found"));
    }
    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      user,
    });
  } catch (error) {
    return next(error);
  }
};

//forgot password
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await handleForgotPassword(req, res, next, "user");
  } catch (error) {
    return next(error);
  }
};

//verify forgot password otp
export const verifyUserForgotPasswordOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await verifyForgotPasswordOtp(req, res, next);
  } catch (error) {
    return next(error);
  }
};
//reset password
export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return next(new ValidationError("all fields are required"));
    }
    //check if user exists
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return next(new ValidationError("user not found"));
    }
    //check if new password is same as old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password!);
    if (isSamePassword) {
      return next(
        new ValidationError("new password cannot be same as old password")
      );
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
  } catch (error) {
    return next(error);
  }
};

//register a new seller
export const registerSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, "seller");
    const { name, email } = req.body;

    const existingSeller = await prisma.sellers.findUnique({
      where: {
        email: email,
      },
    });
    if (existingSeller) {
      return next(new ValidationError("seller already exists with this email"));
    }
    await checkOtpRestriction(email, next);
    await trackOtpRequest(email, next);
    await sendOtp(email, "seller-activation-mail", name);
    res.status(200).json({
      message: "OTP sent to your email",
    });
  } catch (error) {
    return next(error);
  }
};

//verify seller otp
export const verifySeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, password, name, phone_number, country } = req.body;
    if (!email || !otp || !password || !name || !phone_number || !country) {
      return next(new ValidationError("all fields are required"));
    }
    const existingSeller = await prisma.sellers.findUnique({
      where: {
        email: email,
      },
    });
    if (existingSeller) {
      return next(new ValidationError("seller already exists with this email"));
    }
    //verify otp first
    await verifyOtp(email, otp, next);

    //only create seller after OTP verification is successful
    const hashedPassword = await bcrypt.hash(password, 10);
    const seller = await prisma.sellers.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone_number,
        country,
      },
    });
    res.status(200).json({
      success: true,
      message: "Seller created successfully",
      seller,
    });
  } catch (error) {
    return next(error);
  }
};

//create shop
export const createShop = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, bio, category, address, opening_hours, website, sellerId } = req.body;
    console.log(req.body);
    if(!name || !bio || !category || !address || !opening_hours || !website || !sellerId) {
      return next(new ValidationError("all fields are required"));
    }
    
    const shopdata:any={
      name,
      bio,
      category,
      address,
      opening_hours,
      website,
      sellerId,
    }

    if(website && website.trim() !== ""){
      shopdata.website = website;
    }
   
    const shop = await prisma.shops.create({
      data: shopdata,
    });
    

    res.status(200).json({
      success: true,
      shop,
      message: "Shop created successfully",
    });
  } catch (error) {
    return next(error);
  }
};

//create stripe account
export const createStripeConnectLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sellerId } = req.body;

    if(!sellerId) {
      return next(new ValidationError("sellerId is required"));
    }

    const seller = await prisma.sellers.findUnique({
      where: { id: sellerId },
    });

    if(!seller) {
      return next(new ValidationError("seller not found"));
    }

    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: seller?.email,
      capabilities: {
        transfers: {
          requested: true,
        },
        card_payments: {
          requested: true,
        },
      },
    });


    await prisma.sellers.update({
      where: { id: sellerId },
      data: {
        stripeId: account.id,
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `http://localhost:3000/success`,
      return_url: `http://localhost:3000/success`,
      type: 'account_onboarding',
    });

   
    res.status(200).json({
      success: true,
      url: accountLink.url,
      message: "Stripe Connect link created successfully",
    });
  } catch (error) {
    return next(error);
  }
}

//login seller
export const loginSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if(!email || !password) {
      return next(new ValidationError("all fields are required"));
    }

    const seller = await prisma.sellers.findUnique({
      where: {
        email: email,
      },
    });

    if(!seller) {
      return next(new ValidationError("seller not found"));
    }
    
    
const isMatch = await bcrypt.compare(password, seller.password!);
if(!isMatch) {
  return next(new ValidationError("invalid email or password"));
}

res.clearCookie("access_token");
res.clearCookie("refresh_token");

const accessToken = jwt.sign({ id: seller.id, role: "seller" }, process.env.ACCESS_JWT_SECRET as string, { expiresIn: "1h" });
const refreshToken = jwt.sign({ id: seller.id, role: "seller" }, process.env.REFRESH_JWT_SECRET as string, { expiresIn: "7d" });

//store tokens in cookies
setCookies(res, "seller_access_token", accessToken);
setCookies(res, "seller_refresh_token", refreshToken);

res.status(200).json({
  success: true,
  message: "Seller logged in successfully",
  seller: {
    id: seller.id,
    name: seller.name,
    email: seller.email,
  },
});
    
  } catch (error) {
    return next(error);
  }
}

//get logged in seller details
export const getLoggedInSellerDetails = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const seller = req.seller;
    if(!seller) {
      return next(new AuthenticationError("seller not found"));
    }

    res.status(200).json({
      success: true,
      message: "Seller details fetched successfully",
      seller
    });
  } catch (error) {
    return next(error);
  }
}