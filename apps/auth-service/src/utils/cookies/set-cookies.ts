import { Response } from "express";

export const setCookies = (res: Response, name: string, value: string) => {
    res.cookie(name, value, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

export const clearCookies = (res: Response, name: string) => {
    res.clearCookie(name);
}