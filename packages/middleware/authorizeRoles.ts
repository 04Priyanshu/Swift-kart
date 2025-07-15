import { AuthenticationError } from "@packages/error-handler";
import { NextFunction, Response } from "express";

export const isSeller = (req: any, res: Response, next: NextFunction) => {
  if(req.role !== "seller") {
    return next(new AuthenticationError("Unauthorized!! You are not a seller"));
  }
  next();
}

export const isUser = (req: any, res: Response, next: NextFunction) => {
  if(req.role !== "user") {
    return next(new AuthenticationError("Unauthorized!! You are not a user"));
  }
  next();
}