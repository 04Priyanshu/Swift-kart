import { NextFunction, Request, Response } from "express";
import { checkOtpRestriction, sendOtp, trackOtpRequest, validateRegistrationData } from "../utils/auth.helper";
import { ValidationError } from "@packages/error-handler";
import prisma from "@packages/libs/prisma";

//Register
export const userRegistration = async (req: Request, res: Response , next: NextFunction) => {
try {
    validateRegistrationData(req.body , "user");
    const {name , email} = req.body;
   
    const existingUser = await prisma.users.findUnique({
       where: {
           email: email
       }
    });
    if (existingUser) {
       return next(new ValidationError("user already exists with this email"));
    }
   
    await checkOtpRestriction(email , next);
   await trackOtpRequest(email , next);
   await sendOtp(email , "user-activation-mail" , name);
   
   res.status(200).json({
       message: "OTP sent to your email",
   })
} catch (error) {
    return next(error);
}
}