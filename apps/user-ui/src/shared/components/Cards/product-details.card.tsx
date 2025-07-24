import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Ratings from "../ratings";
import { CarrotIcon, ChartArea, Heart, MapPin, ShoppingBag, ShoppingCartIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { P } from "node_modules/framer-motion/dist/types.d-Bq-Qm38R";
import { spawn } from "child_process";
import useUser from "apps/user-ui/src/hooks/useUser";
import useLocation from "apps/user-ui/src/hooks/useLocation";
import useDeviceTracking from "apps/user-ui/src/hooks/useDeviceTracking";
import { useStore } from "apps/user-ui/src/store";

const ProductDetailsCard = ({
  data,
  setOpen,
}: {
  data: any;
  setOpen: (open: boolean) => void;
}) => {
  const [activeImage, setActiveImage] = useState(0);
  const router = useRouter();
  const [isSelected, setIsSelected] = useState(data?.colors?.[0] || " ");
  const [isSizeSelected, setIsSizeSelected] = useState(data?.sizes?.[0] || " ");
  const [quantity, setQuantity] = useState(1);

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  const {user} = useUser();
  const location = useLocation();
  const deviceInfo = useDeviceTracking();

  const addToCart = useStore((state : any)=>state.addToCart);
  const addToWishlist = useStore((state : any)=>state.addToWishlist);
  const removeFromWishlist = useStore((state : any)=>state.removeFromWishlist);
  const cart = useStore((state : any)=>state.cart);
  const isInCart = cart.some((item : any)=>item.id === data.id);

  const wishlist = useStore((state : any)=>state.wishlist);
  const isInWishlist = wishlist.some((item : any)=>item.id === data.id);

  return (
    <div
      className="fixed flex items-center justify-center top-0 left-0 w-full h-screen bg-[#0000001d] z-50"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-[90%] md:w-[60%] md:mt-14 2xl:mt-0 h-max overflow-scroll min-h-[70vh] md:p-6 bg-white rounded-lg shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-full">
            <Image
              src={data?.images?.[activeImage]?.url}
              alt={data?.images?.[activeImage]?.url}
              width={400}
              height={400}
              className="w-full rounded-lg object-contain"
            />
            {/* {thumbnails} */}
            <div className="flex gap-2 mt-4">
              {data?.images?.map((image: any, index: number) => (
                <div
                  key={index}
                  className={`cursor-pointer border rounded-md ${
                    activeImage === index
                      ? "border-gray-500 pt-1"
                      : "border-transparent"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={image?.url || ""}
                    alt={`Thumbnail ${index}`}
                    width={80}
                    height={80}
                    className=" rounded-md "
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0">
            {/* seller info */}
            <div className="border-b relative pb-3 border-gray-200 flex items-center justify-between">
              <div className="flex items-start gap-3">
                {/* shop logo */}
                {data?.shop?.avatar ? (
                  <Image
                    src={data.shop.avatar}
                    alt="shop logo"
                    width={60}
                    height={60}
                    className="rounded-full object-cover w-[60px] h-[60px]"
                  />
                ) : null}
                <div>
                  <Link
                    href={`/shop/${data?.shop?.id}`}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    {data?.shop?.name}
                  </Link>
                  <span className="block mt-1">
                    <Ratings rating={data?.shop?.ratings} />
                  </span>
                  <p className="text-gray-600 mt-1 flex items-center gap-1">
                    <MapPin size={16} />{" "}
                    {data?.shop?.address || "Location not available"}
                  </p>
                </div>
              </div>
              <button
                className="bg-black cursor-pointer flex items-center gap-2 text-white px-4 py-2 rounded-md hover:scale-105 transition "
                onClick={() => router.push(`/inbox?shopid=${data?.shop?.id}`)}
              >
                💬 chat with seller
              </button>

              <button
                className="w-full absolute cursor-pointer right-[-5px] top-[-5px] flex justify-end my-2 mt-[-10px] "
                onClick={() => setOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <h3 className="text-xl font-semibold mt-3">{data?.title}</h3>

            <p className="mt-2 text-gray-700 whitespace-pre-wrap w-full">
              {data?.short_description}{" "}
              {
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
              }
            </p>

            {/* Brand */}
            {data?.brand && (
              <p className="mt-2 text-gray-700">
                <strong> Brand: </strong>
                {data?.brand}
              </p>
            )}

            {/* Colour and size selection */}
            <div className="flex flex-col md:flex-row items-start gap-5 mt-4">
              {/* Colour */}
              {data?.colors?.length > 0 && (
                <div>
                  <strong> Colour: </strong>
                  <div className="flex gap-2 mt-1">
                    {data?.colors?.map((color: string, index: number) => (
                      <button
                        key={index}
                        className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                          isSelected === color
                            ? "border-2 border-gray-400 scale-110 shadow-md"
                            : "border-transparent"
                        }`}
                        onClick={() => setIsSelected(color)}
                        style={{ backgroundColor: color }}
                      ></button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size */}
              {data?.sizes?.length > 0 && (
                <div>
                  <strong> Size: </strong>
                  <div className="flex gap-2 mt-1">
                    {data?.sizes?.map((size: string, index: number) => (
                      <button
                        key={index}
                        className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                          isSizeSelected === size
                            ? "border-2 border-gray-400 scale-110 shadow-md"
                            : "border-transparent"
                        }`}
                        onClick={() => setIsSizeSelected(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              </div>

              {/* Price */}
              <div className="mt-5 flex items-center gap-4">
                <h3 className="text-2xl font-semibold text-gray-900">
                  ${data?.sale_price}
                </h3>
                {data?.regular_price && (
                  <h3 className="text-red-500 text-lg line-through">
                    ${data?.regular_price}
                  </h3>
                )}
              </div>
              <div className="flex items-center gap-5 mt-5">
                <div className="flex items-center rounded-md">
                  <button
                    className="px-3 cursor-pointer py-1 bg-gray-300 hover:bg-gray-400 rounded-md text-black"
                    onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                  >
                    -
                  </button>
                  <span className="px-4 bg-gray-100 py-1">{quantity}</span>
                  <button
                    className="px-3 cursor-pointer py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
                <button disabled={isInCart} className={`flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition ${isInCart ? "opacity-50 cursor-not-allowed" : ""}`} onClick={()=>{
                  addToCart({...data,quantity,selectedOptions:{color:isSelected,size:isSizeSelected}},user,location,deviceInfo);
                }}>
                  <ShoppingCartIcon size={20} />Add to Cart
                </button>
                <button  className={`opacity-[.7] cursor-pointer  ${isInWishlist ? "opacity-50 cursor-not-allowed" : ""}`} onClick={()=>{
                 isInWishlist ? removeFromWishlist(data.id,user,location,deviceInfo) : addToWishlist({...data,quantity,selectedOptions:{color:isSelected,size:isSizeSelected}},user,location,deviceInfo);
                }}>
                  <Heart size={30} fill={isInWishlist ? "red" : "none"} color="black" />
                </button>
              </div>

              <div className="mt-3">
                {
                    data.stock>0 ? (
                        <span className="text-green-500 font-semibold">In Stock</span>
                    ):(
                        <span className="text-red-500 font-semibold">Out of Stock</span>
                    )
                }
              </div>{" "}

              <div className="mt-3 text-gray-600 text-sm">
                Estimated Delivery:{" "}
                <strong>
                  {estimatedDelivery.toDateString()}
                </strong>
              </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
