import { Divide, Eye, Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Ratings from "../ratings";
import ProductDetailsCard from "./product-details.card";
import { useStore } from "../../../store";
import useUser from "apps/user-ui/src/hooks/useUser";
import useLocation from "apps/user-ui/src/hooks/useLocation";
import useDeviceTracking from "apps/user-ui/src/hooks/useDeviceTracking";


const ProductCard = ({
  product,
  isEvent,
}: {
  product: any;
  isEvent?: boolean;
}) => {
  console.log("ProductCard received product:", product);

  const [timeleft, setTimeleft] = useState("");
  const [open, setOpen] = useState(false);

  const {user} = useUser();
  const location = useLocation();
  const deviceInfo = useDeviceTracking();


  console.log("Device Info:",deviceInfo);
  console.log("Location:",location);


  const addToWishlist = useStore((state : any)=>state.addToWishlist);
  const removeFromWishlist = useStore((state : any)=>state.removeFromWishlist);
  const addToCart = useStore((state : any)=>state.addToCart);
  const removeFromCart = useStore((state : any)=>state.removeFromCart);
  const wishlist = useStore((state : any)=>state.wishlist);
  const isWishlisted = wishlist.some((item : any)=>item.id === product.id);
  const cart = useStore((state : any)=>state.cart);
  const isInCart = cart.some((item : any)=>item.id === product.id);

  
  

  useEffect(() => {
    if (isEvent && product?.ending_date) {
      const interval = setInterval(() => {
        const endTime = new Date(product?.ending_date).getTime();
        const now = new Date().getTime();
        const timeDiff = endTime - now;
        if (timeDiff <= 0) {
          setTimeleft("expired");
          clearInterval(interval);
          return;
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDiff / 1000) % 60);

        setTimeleft(
          `${days}d ${hours}h ${minutes}m ${seconds}s left with this offer`
        );
      }, 60000);

      return () => clearInterval(interval);
    }
    return;
  }, [isEvent, product?.ending_date]);

  // Check if product has required fields
  if (!product) {
    console.error("Product is undefined or null");
    return null;
  }

  if (!product.images || product.images.length === 0) {
    console.error("Product has no images:", product);
    return null;
  }

  return (
    <div className="w-full min-h-[350px] bg-white rounded-lg relative flex flex-col">
      {isEvent && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-semibold px-2 py-1 rounded-sm shadow-md">
          OFFER
        </div>
      )}

      {product?.stock <= 5 && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-slate-700 text-[10px] font-semibold px-2 py-1 rounded-sm shadow-md">
          Limited Stock
        </div>
      )}

      <Link href={`/product/${product?.slug}`}>
        <div className="w-full h-full">
          <img
            src={
              product.images[0].url ||
              "https://unsplash.com/photos/black-smartphone-displaying-11-00-83ypHTv6J2M"
            }
            width={300}
            height={300}
            alt={product.title}
            className="w-full h-[200px] mx-auto rounded-t-md object-cover"
          />
        </div>
      </Link>

      <div className="flex flex-col gap-1 px-2 pt-2 pb-3">
        <Link
          href={`/shop/${product?.shop?.id}`}
          className="text-blue-500 text-sm font-medium"
        >
          {product?.shop?.name}
        </Link>
        <Link href={`/product/${product?.slug}`}>
          <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
            {product?.title}
          </h3>
        </Link>
      </div>

      <div className="mt-2 px-2">
        <Ratings rating={product?.rating} />
      </div>

      <div className="mt-3 flex justify-between items-center px-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${product?.sale_price}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ${product?.regular_price}
          </span>
        </div>
        <span className="text-sm font-medium text-green-500">
          {product?.totalSales} sold
        </span>
      </div>
      {isEvent && timeleft && (
        <div className="mt-2">
          <span className="inline-block text-xs bg-orange-100 text-orange-500 px-2 py-1 rounded-md">
            {timeleft}
          </span>
        </div>
      )}
      <div className="absolute z-10 flex flex-col gap-3 right-2 top-2">
        <div className="bg-white rounded-full p-[6px] shadow-md">
          <Heart
            className="cursor-pointer hover:scale-110 transition"
            size={20}
            fill={isWishlisted ? "red" : "none"}
            onClick={()=>{
              if(isWishlisted){
                removeFromWishlist(product.id,user,location,deviceInfo);
              }else{
                addToWishlist({...product,quantity:1},user,location,deviceInfo);
              }
            }}
            stroke={isWishlisted ? "red" : "black"}
          />
        </div>
        <div className="bg-white rounded-full p-[6px] shadow-md">
          <Eye
            className="cursor-pointer hover:scale-110 transition"
            size={20}
            fill="none"
            stroke="black"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="bg-white rounded-full p-[6px] shadow-md">
          <ShoppingBag className="cursor-pointer hover:scale-110 transition" size={20} onClick={()=>{
            !isInCart && addToCart({...product,quantity:1},user,location,deviceInfo);
          }} fill="none" stroke="black"/>
        </div>
      </div>

      {
        open && (
          <ProductDetailsCard data={product} setOpen={setOpen}/>
        )
      }
    </div>
  );
};

export default ProductCard;
