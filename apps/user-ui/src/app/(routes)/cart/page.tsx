"use client";

import useDeviceTracking from "apps/user-ui/src/hooks/useDeviceTracking";
import useLocation from "apps/user-ui/src/hooks/useLocation";

import useUser from "apps/user-ui/src/hooks/useUser";
import Link from "next/link";
import React, { useState } from "react";
import { useStore } from "apps/user-ui/src/store";

import Image from "next/image";
import { Loader2, Trash2 } from "lucide-react";
import { P } from "node_modules/framer-motion/dist/types.d-Bq-Qm38R";

const CartPage = () => {
  // const router = useRouter();
  const { user } = useUser();
  const location = useLocation();
  const deviceInfo = useDeviceTracking();
  const cart = useStore((state: any) => state.cart);
  const [discountedProductId, setDiscountedProductId] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const removeFromCart = useStore((state: any) => state.removeFromCart);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const decreaseQuantity = (id: string) => {
    useStore.setState((state: any) => ({
      cart: state.cart.map((item: any) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    }));
  };

  const increaseQuantity = (id: string) => {
    useStore.setState((state: any) => ({
      cart: state.cart.map((item: any) =>
        item.id === id ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item
      ),
    }));
  };

  const subTotal = cart.reduce(
    (total: number, item: any) => total + item.quantity * (item.sale_price || item.price || 0),
    0
  );

  return (
    <div className="w-full bg-white ">
      <div className="md:w-[80%] w-[95%] mx-auto min-h-screen">
        <div className="pb-[50px]">
          <h1 className="md:pt-[50px] font-medium text-[44px] leading-[1] mb-[16px] font-jost ">
            Shopping Cart
          </h1>
          <Link href="/" className="text-[#55585b] hover:underline">
            Home
          </Link>
          <span className="inline-block p-[1.5px] mx-1 bg-transparent rounded-full ">
            .
          </span>
          <span className=" text-[#55585b]">Shopping Cart</span>
        </div>

        {cart.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            Your cart is empty!! Start adding products to your cart.
          </div>
        ) : (
          <div className="lg:flex items-start gap-10">
            <table className="w-full border-collapse lg:w-[70%]">
              <thead className="bg-[#f1f3f4] rounded-lg">
                <tr>
                  <th className="text-left py-3 pl-4">Product</th>
                  <th className="text-left py-3 px-6 min-w-[100px]">Price</th>
                  <th className="text-left py-3">Quantity</th>
                  <th className="text-left py-3"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item: any) => (
                  <tr key={item.id} className="border-b border-b-[#0000000e]">
                    <td className="flex items-center gap-3 p-4">
                      <Image
                        src={item?.images?.[0]?.url || item?.image || "/placeholder-image.jpg"}
                        alt={item?.title || "Product"}
                        width={80}
                        height={80}
                        className="rounded"
                      />
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{item?.title || "Product"}</span>
                        {item?.selectedOptions && (
                          <div className="text-sm text-[#55585b]">
                            {item?.selectedOptions.colors && (
                              <span className="text-sm text-[#55585b]">
                                Color: {item?.selectedOptions.colors}
                                <span
                                  style={{
                                    backgroundColor:
                                      item?.selectedOptions.colors,
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "100%",
                                    display: "inline-block",
                                  }}
                                />
                              </span>
                            )}

                            {item?.selectedOptions.sizes && (
                              <span className=" ml-2 text-sm text-[#55585b]">
                                Size: {item?.selectedOptions.sizes}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 text-lg text-left min-w-[100px]">
                      {item?.id === discountedProductId ? (
                        <div className="flex flex-col">
                          <span className="line-through text-sm text-[#55585b]">
                            ${(item.sale_price || item.price || 0).toFixed(2)}
                          </span>{" "}
                          <span className="text-green-600 font-semibold">
                            $
                            {(
                              ((item.sale_price || item.price || 0) * (100 - discountPercentage)) /
                              100
                            ).toFixed(2)}
                          </span>
                          <span className="text-xs text-green-700 bg-white">
                            Discount Applies
                          </span>
                        </div>
                      ) : (
                        <span>${(item.sale_price || item.price || 0).toFixed(2)}</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center justify-center bg-gray-200 rounded-[20px] w-[90px] p-[2px] ">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="text-black cursor-pointer text-xl"
                        >
                          -
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="text-black cursor-pointer text-xl"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() =>
                          removeFromCart(item.id, user, location, deviceInfo)
                        }
                        className="text-[#818487] cursor-pointer hover:text-[#ff1826] hover:scale-105 transition duration-200 flex items-center gap-2"
                      >
                        <Trash2 size={20} />
                        <span>Remove </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-6 w-full shadow-md lg:w-[30%] rounded-lg bg-[#f9f9ff9]">
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-[#010f1c] text-base font font-medium pb-1">
                  <span className="font-jost">
                    Discount({discountPercentage}%)
                  </span>
                  <span className="text-green-600">
                    -${discountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-[#010f1c] text-[20px] font-medium pb-3">
                <span className="font-jost">Subtotal</span>
                <span className="font-semibold">${subTotal.toFixed(2)}</span>
              </div>
              <hr className="my-4 text-slate-200 " />

              <div className="mb-4">
                <h4 className="mb-[7px] font-[500] text-[15px]  ">
                  Have a Coupon?
                </h4>
                <div className="flex">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Coupon Code"
                    className="w-full border border-gray-200 rounded-l-md p-2 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    // onClick={() => applyCoupon()}
                    className="bg-gray-800 hover:bg-black/80 hover:scale-105 transition-all cursor-pointer text-white rounded-r-md px-4"
                  >
                    Apply
                  </button>
                  {/* {error && (
                    <p className="text-red-500 pt-2 text-sm">{error}</p>
                  )} */}
                </div>
                <hr className="my-4 text-slate-200 " />

                <div className="mb-4">
                    <h4 className="mb-[7px] font-medium text-[15px]  ">
                       Select Shipping address
                    </h4>
                    <select className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:border-blue-500" value={selectedAddressId} onChange={(e)=>setSelectedAddressId(e.target.value)}>
                        <option value="123">Home - 123 Main St, Anytown - USA</option>
                    </select>
                </div>
                <hr className="my-4 text-slate-200 " />

                <div className="mb-4">
                    <h4 className="mb-[7px] font-medium text-[15px]  ">
                       Select Payment Method
                    </h4>
                    <select className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:border-blue-500" value={selectedPaymentMethod} onChange={(e)=>setSelectedPaymentMethod(e.target.value)}>
                        <option value="credit_card">Credit Card</option>
                        <option value="cash_on_delivery">Cash on Delivery</option>
                    </select>
                   
                </div>
                <hr className="my-4 text-slate-200 " />


                <div className="flex justify-between items-center text-[#010f1c] text-[20px] font-[550] pb-3 ">
                    <span className="font-jost">Total</span>
                    <span className="font-semibold">${(subTotal-discountAmount).toFixed(2)}</span>
                </div>

                <button disabled={loading} className="w-full bg-black text-white py-3 rounded-md hover:bg-black/80 hover:scale-105 transition-all cursor-pointer">
                    {loading && <Loader2 className="animate-spin w-5 h-5" />}
                    {loading ? "Processing..." : "Proceed to Checkout"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
