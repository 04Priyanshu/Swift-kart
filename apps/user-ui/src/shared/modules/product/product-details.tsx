"use client";
import {
  ArrowRight,
  ChevronLeftIcon,
  ChevronRightIcon,
  Heart,
  MapPin,
  MessageSquareText,
  Package,
  ShoppingBasketIcon,
  ShoppingCartIcon,
  WalletMinimal,
} from "lucide-react";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import ReactImageMagnify from "react-image-magnify";
import Ratings from "../../components/ratings";
import Link from "next/link";
import { useStore } from "apps/user-ui/src/store";
import useUser from "apps/user-ui/src/hooks/useUser";
import useLocation from "apps/user-ui/src/hooks/useLocation";
import useDeviceTracking from "apps/user-ui/src/hooks/useDeviceTracking";
import ProductCard from "../../components/Cards/product-card";
import axiosInstance from "apps/user-ui/src/utils/axiosinstance";

const ProductDetails = ({ productDetails }: { productDetails: any }) => {
  const { user, isLoading } = useUser();
  const location = useLocation();
  const deviceInfo = useDeviceTracking();

  const [currentImage, setCurrentImage] = useState(
    productDetails?.images[0]?.url
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentColor, setCurrentColor] = useState(
    productDetails?.colors[0] || ""
  );
  const [currentSize, setCurrentSize] = useState(
    productDetails?.sizes[0] || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [priceRange, setPriceRange] = useState([
    productDetails?.sale_price,
    1199,
  ]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const addToCart = useStore((state: any) => state.addToCart);
  const cart = useStore((state: any) => state.cart);
  const isInCart = cart.some((item: any) => item.id === productDetails?.id);
  const addToWishlist = useStore((state: any) => state.addToWishlist);
  const removeFromCart = useStore((state: any) => state.removeFromCart);
  const removeFromWishlist = useStore((state: any) => state.removeFromWishlist);
  const wishlist = useStore((state: any) => state.wishlist);
  const isWishlisted = wishlist.some(
    (item: any) => item.id === productDetails?.id
  );


  const getFilteredProducts = async () => {
    try {
        const query = new URLSearchParams();
        query.set("priceRange", priceRange.join("-"))
        query.set("page", "1")
        query.set("limit", "10")
        const res =await axiosInstance.get(`/product/api/get-filtered-products?${query.toString()}`)
        setRecommendedProducts(res.data.products)


    } catch (error) {
        console.log("error in getFilteredProducts", error)
    }
  }

  useEffect(() => {
    getFilteredProducts()
  }, [priceRange])

  //navigate to previous image
  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setCurrentImage(productDetails?.images[currentImageIndex - 1]);
    }
  };

  //navigate to next image
  const nextImage = () => {
    if (currentImageIndex < productDetails?.images?.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setCurrentImage(productDetails?.images[currentImageIndex + 1]);
    }
  };

  //calculate discount percentage
  const discountPercentage = Math.round(
    ((productDetails?.regular_price - productDetails?.sale_price) /
      productDetails?.regular_price) *
      100
  );

  return (
    <div className="w-full bg-[#f5f5f5] py-5">
      <div className=" w-[90%] bg-white lg:w-[80%] mx-auto pt-6 grid grid-cols-1 lg:grid-cols-[28%_44%_28%] gap-6 overflow-hidden">
        {/* left coloumn */}
        <div className="p-4">
          <div className="realtive w-full">
            {/* main image with zoom */}
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "product image",
                  isFluidWidth: true,
                  src: currentImage,
                },
                largeImage: {
                  src: currentImage,
                  width: 1200,
                  height: 1200,
                },
                enlargedImageContainerDimensions: {
                  width: "150%",
                  height: "150%",
                },
                enlargedImageContainerStyle: {
                  border: "none",
                  boxShadow: "none",
                },
                enlargedImagePosition: "right",
              }}
            />
          </div>

          {/* thumbnail image */}
          <div className="relative flex items-center gap-2 mt-4 overflow-hidden">
            {productDetails?.images?.length > 4 && (
              <button
                className="absolute left-0 bg-white p-2 rounded-full shadow-md z-10"
                onClick={prevImage}
                disabled={currentImageIndex === 0}
              >
                <ChevronLeftIcon size={24} />
              </button>
            )}

            <div className="flex gap-2 overflow-x-auto">
              {productDetails?.images?.map((image: any, index: number) => (
                <Image
                  key={index}
                  src={image?.url}
                  alt="product image"
                  width={64}
                  height={64}
                  className={`cursor-pointer border rounded-lg p-1 ${
                    currentImage === image
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => {
                    setCurrentImage(image);
                    setCurrentImageIndex(index);
                  }}
                />
              ))}
            </div>
            {productDetails?.images?.length > 4 && (
              <button
                className="absolute right-0 bg-white p-2 rounded-full shadow-md z-10"
                onClick={nextImage}
                disabled={
                  currentImageIndex === productDetails?.images?.length - 1
                }
              >
                <ChevronRightIcon size={24} />
              </button>
            )}
          </div>
        </div>

        {/* middle column */}
        <div className="p-4">
          <h1 className="text-xl mb-2 font-medium">{productDetails?.title}</h1>
          <div className="w-full flex items-center justify-between">
            <div className="flex mt-2 gap-2 text-yellow-500">
              <Ratings rating={productDetails?.rating} />
              <Link
                href={`#reviews`}
                className="text-sm text-gray-500 hover:underline"
              >
                (0 reviews)
              </Link>
            </div>

            <div>
              <Heart
                size={24}
                onClick={() => {
                  isWishlisted
                    ? removeFromWishlist(
                        productDetails?.id,
                        user,
                        location,
                        deviceInfo
                      )
                    : addToWishlist(
                        {
                          ...productDetails,
                          quantity: 1,
                          selectedOptions: {
                            colors: currentColor,
                            sizes: currentSize,
                          },
                        },
                        user,
                        location,
                        deviceInfo
                      );
                }}
                fill={isWishlisted ? "red" : "transparent"}
                className="cursor-pointer"
                color="black"
              />
            </div>
          </div>

          <div className="py-2 border-b border-gray-200">
            <span className="text-gray-500">
              Brand:{" "}
              <span className="font-medium text-blue-500">
                {productDetails?.brand || "N/A"}
              </span>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-orange-500">
              ${productDetails?.sale_price}
            </span>
            <div className="flex gap-2 text-lg border-b border-b-slate-200">
              <span className="text-gray-500 line-through">
                ${productDetails?.regular_price}
              </span>
              <span className="text-green-500">
                -{discountPercentage.toFixed(0)}%
              </span>
            </div>
            <div className="mt-2">
              <div className="flex flex-col gap-5 mt-4 md:flex-row items-start">
                {productDetails?.colors?.length > 0 && (
                  <div>
                    <strong>Color:</strong>
                    <div className="flex gap-2 mt-1">
                      {productDetails?.colors?.map(
                        (color: any, index: number) => (
                          <button
                            key={index}
                            className={`w-8 h-8 cursor-pointer border-2 transition duration-300 rounded-full ${
                              currentColor === color
                                ? "border-gray-400 scale-110 shadow-md"
                                : "border-transparent"
                            }`}
                            onClick={() => {
                              setCurrentColor(color);
                            }}
                            style={{ backgroundColor: color }}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}
                {productDetails?.sizes?.length > 0 && (
                  <div>
                    <strong>Size:</strong>
                    <div className="flex gap-2 mt-1">
                      {productDetails?.sizes?.map(
                        (size: any, index: number) => (
                          <button
                            key={index}
                            className={`px-4 py-1 cursor-pointer border-2 transition duration-300 rounded-md ${
                              currentSize === size
                                ? "bg-gray-800 text-white"
                                : "bg-gray-300 text-black"
                            }`}
                            onClick={() => {
                              setCurrentSize(size);
                            }}
                          >
                            {size}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-2">
                <button
                  className="w-8 h-8 cursor-pointer transition duration-300 rounded-md bg-gray-300 text-black"
                  onClick={() => {
                    setQuantity((prev: number) => Math.max(prev - 1, 1));
                  }}
                >
                  -
                </button>
                <span className="text-lg  font-medium">{quantity}</span>
                <button
                  className="w-8 h-8 cursor-pointer transition duration-300 rounded-md bg-gray-300 text-black"
                  onClick={() => {
                    setQuantity((prev: number) => Math.min(prev + 1, 10));
                  }}
                >
                  +
                </button>
              </div>
              {productDetails?.stock > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-green-500">
                    In Stock (stock:{productDetails?.stock})
                  </span>
                </div>
              )}
              {productDetails?.stock === 0 && (
                <div className="mt-2">
                  <span className="text-sm text-red-500">Out of Stock</span>
                </div>
              )}
            </div>
            <button
              className={`flex mt-6 items-center gap-2 px-5 py-[10px] bg-[#ff5722] hover:bg-[#e64a19] text-white font-medium rounded-lg transition ${
                isInCart ? "cursor-not-allowed" : "cursor-pointer"
              } `}
              disabled={isInCart || productDetails?.stock === 0}
              onClick={() => {
                addToCart(
                  {
                    ...productDetails,
                    quantity: quantity,
                    selectedOptions: {
                      colors: currentColor,
                      sizes: currentSize,
                    },
                  },
                  user,
                  location,
                  deviceInfo
                );
              }}
            >
              <ShoppingCartIcon size={20} className="w-5 h-5" />
              {isInCart ? "Added to Cart" : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* right column */}
        <div className="bg-[#fafafa] -mt-6">
          <div className="mb-1 p-3 border-b border-b-gray-100">
            <span className="text-sm text-gray-600">Delivery Option</span>
            <div className="flex items-center text-gray-600 gap-1">
              <MapPin size={16} className="ml-[-5px]" />
              <span className="text-lg font-normal">
                {location?.city + ", " + location?.country}
              </span>
            </div>
          </div>
          <div className="mb-1 px-3 pb-1 border-b border-b-gray-100">
            <span className="text-sm text-gray-600">Return and Warranty</span>
            <div className="flex items-center text-gray-600 gap-1">
              <Package size={16} className="ml-[-5px]" />
              <span className="text-base font-normal">
                7 Days Return Policy
              </span>
            </div>
            <div className="flex items-center text-gray-600 gap-1 py-2">
              <WalletMinimal size={16} className="ml-[-5px]" />
              <span className="text-base font-normal">
                Warranty not available
              </span>
            </div>
          </div>

          <div className="px-3 py-1">
            {/* sold by section */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-600 font-light">
                  Sold by
                </span>
                <span className="block max-w-[150px] truncate font-medium text-lg">
                  {productDetails?.Shop?.name}
                </span>
              </div>
              <Link
                href={"#"}
                className="text-blue-500 text-sm flex items-center gap-1"
              >
                <MessageSquareText />
                Chat with seller
              </Link>
            </div>
            {/* seller performance */}
            <div className="grid grid-cols-3 gap-2 border-t-gray-200 mt-3 pt-3">
              <p className="text-[12px] text-gray-600">
                Positive seller rating
              </p>
              <p className="text-lg font-semibold">88%</p>
            </div>
            <div>
              <p className="text-[12px] text-gray-600">Ship on time</p>
              <p className="text-lg font-semibold">88%</p>
            </div>
            <div>
              <p className="text-[12px] text-gray-600">Chat response rate</p>
              <p className="text-lg font-semibold">88%</p>
            </div>
          </div>
          {/* go to the store */}
          <div className="text-center mt-4 border-t border-t-gray-200 pt-2">
            <Link
              href={`/shop/${productDetails?.Shop?.id}`}
              className="text-blue-500 text-sm font-medium hover:underline"
            >
              <ArrowRight size={16} className="ml-[-5px]" />
              Go to the store
            </Link>
          </div>
        </div>
      </div>

      <div className="w-[90%] lg:w-[80%] mx-auto mt-5">
        <div className="bg-white min-h-[60vh] h-full p-5">
          <h3 className="text-lg font-medium">Product details</h3>
          <div
            className="prose prose-sm text-slate-200 max-w-none"
            dangerouslySetInnerHTML={{
              __html: productDetails?.detailed_description,
            }}
          />
        </div>
      </div>
      <div className="w-[90%] lg:w-[80%] mx-auto mt-5">
        <div className="bg-white min-h-[50vh] h-full p-5">
          <h3 className="text-lg font-medium">Ratings and Reviews</h3>
          <p className="text-center pt-14">No reviews yet</p>
        </div>
      </div>
      <div className="w-[90%] lg:w-[80%] mx-auto mt-5">
        <div className="w-full h-full my-5 p-5">
          <h3 className="text-xl mb-2 font-medium">You may also like</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 m-auto">
            {recommendedProducts?.map((product: any) => (
              <ProductCard key={product?.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
