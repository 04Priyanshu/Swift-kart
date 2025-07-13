import crypto from "crypto";
import { ValidationError } from "@packages/error-handler";
import { NextFunction } from "express";
import redis from "@packages/libs/redis";
import { sendEmail } from "./sendMail";
import { Request, Response } from "express";
import prisma from "@packages/libs/prisma";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const validateRegistrationData = (data: any , userType: "user" | "seller") => {
    const { name, email, password , phone_number , country } = data;
    if (!name || !email || !password|| (userType == "seller" && (!phone_number || !country))) {
        throw new ValidationError("missing registration data");
    }
    if (!emailRegex.test(email)) {
        throw new ValidationError("invalid email");
    }
  
};

export const checkOtpRestriction = async (email: string , next: NextFunction) => {
   if (await redis.get(`otp_lock:${email}`)) {
    return next(new ValidationError("please wait before requesting another OTP"));
   }
   if(await redis.get(`otp_spam_lock:${email}`)) {
    return next(new ValidationError("Too many OTP requests. Please try again later."));
   }
   if(await redis.get(`otp_cooldown:${email}`)) {
    return next(new ValidationError("please wait 1 minute before requesting another OTP"));
   }
}

export const trackOtpRequest = async (email: string , next: NextFunction) => {
   const otpRequestCount = `otp_request_count:${email}`;
   let otpRequests = parseInt((await redis.get(otpRequestCount)) || "0");
   if(otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "true", "EX", 3600);
    return next(new ValidationError("Too many OTP requests. Please try again later."));
   }
   await redis.set(otpRequestCount, (otpRequests + 1).toString(), "EX", 3600);
}

export const sendOtp = async (email: string , template: string , name: string) => {
    const otp = crypto.randomInt(10000 , 99999);
    await sendEmail(email, "Verify your email", template, {
        name,
        otp,
        email
    });
    await redis.set(`otp:${email}`, otp, "EX", 60 * 5);
   await redis.set(`otp_cool_down:${email}`, "true", "EX", 60);
}

export const verifyOtp = async (email: string , otp: number , next: NextFunction) => {
    const storedOtp = await redis.get(`otp:${email}`);
    if(!storedOtp) {
        throw new ValidationError("invalid or expired otp");//dont return next here because it will be handled by the error middleware,two return next will cause a loop
    }
    
    const fialedAttemptsKey = `otp_failed_attempts:${email}`;
    const failedAttempts = parseInt((await redis.get(fialedAttemptsKey)) || "0");
    if(storedOtp !== otp.toString()) {
        if(failedAttempts >= 2) {
            await redis.set(`otp_lock:${email}`, "true", "EX", 1800);
            await redis.del(`otp:${email}`, fialedAttemptsKey);
            throw next(new ValidationError("too many failed attempts,account locked for 30 minutes"));
        }
        await redis.set(fialedAttemptsKey, (failedAttempts + 1).toString(), "EX", 300);
        throw next(new ValidationError(`Incorrect OTP, ${2 - failedAttempts} attempts left`));
    }
    await redis.del(`otp:${email}`,fialedAttemptsKey);
} 

export const handleForgotPassword = async (req: Request, res: Response, next: NextFunction, userType: "user" | "seller") => {
    const { email } = req.body;
    if(!email) {
        return next(new ValidationError("email is required"));
    }
    
    //check if user exists
    const user = userType === "user" && await prisma.users.findUnique({
        where: {
            email: email,
        },
    });
    if(!user) {
        return next(new ValidationError(`${userType} not found`));
    }

    await checkOtpRestriction(email, next);
    await trackOtpRequest(email, next);
    await sendOtp(email, "forgot-password-mail", user.name);

    res.status(200).json({
        success: true,
        message: "OTP sent to your email",
    });
}



export const verifyForgotPasswordOtp = async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;
    if(!email || !otp) {
        return next(new ValidationError("all fields are required"));
    }
    await verifyOtp(email, otp, next);
    res.status(200).json({
        success: true,
        message: "OTP verified. You can now reset your password.",
    });
}