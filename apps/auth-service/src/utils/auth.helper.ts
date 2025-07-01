import crypto from "crypto";
import { ValidationError } from "@packages/error-handler";
import { NextFunction } from "express";
import redis from "@packages/libs/redis";
import { sendEmail } from "./sendMail";


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