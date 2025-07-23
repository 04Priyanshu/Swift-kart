import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Product = {
    id : string;
    title : string;
    price : number;
    image : string;
    quantity? : number;
    shopId : string;
}

type Store = {
    cart : Product[];
    wishlist : Product[];
    addToCart : (
        product : Product,
        user:any,
        location:any,
        deviceInfo : string,
    ) => void;
    removeFromCart : (
        id:string,
        user:any,
        location:any,
        deviceInfo:string,
    ) => void;
    addToWishlist : (
        product:Product,
        user:any,
        location:any,
        deviceInfo:string,
    ) => void;
    removeFromWishlist : (
        id:string,
        user:any,
        location:any,
        deviceInfo:string,
    ) => void;
}


export const useStore = create<Store>()(
    persist(
        (set,get)=>({
            cart:[],
            wishlist:[],
            addToCart:()=>{},
            removeFromCart:()=>{},
            addToWishlist:()=>{},
            removeFromWishlist:()=>{},
        }),
    )
)