import prisma from "@packages/libs/prisma";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
   try {
     const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];
     if(!token) {
         return res.status(401).json({message: "Unauthorized!! Token missing"});
     }
     const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET!)as{id: string;role:"user" | "seller"};
     if(!decoded) {
         return res.status(401).json({message: "Unauthorized!! Invalid token"});
     }
     //check if user exists
     const user = await prisma.users.findUnique({
        where: {
            id: decoded.id,
        },
     });

     if(!user) {
        return res.status(401).json({message: "Unauthorized!! User not found"});
     }

     // Attach user to req object in a type-safe way
     req.user = user;

     return next();
   } catch (error) {
    return res.status(401).json({message: "Unauthorized!! Invalid token"});
   }
}

export default isAuthenticated;