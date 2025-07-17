"use client";
import { ChevronRight, Loader2, Plus, Trash, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../../utils/axiosInstance";
import { table } from "console";
import { toast } from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import Input from "packages/components/input";
import { AxiosError } from "axios";
import DeleteDiscountCodeModal from "apps/seller-ui/src/shared/components/modals/delete.discount-code";

// Rectangular Box Animation Loader Component
const RectangularLoader = () => {
  return (
    <div className="flex justify-center items-center gap-1">
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className="w-2 h-4 bg-white rounded-sm animate-pulse"
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  );
};

const page = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<any>(null);
  const queryClient = useQueryClient();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      public_name: "",
      discountType: "percentage",
      discountValue: "",
      discountCode: "",
    },
  });

  const handleDelete = async (discount: any) => {
    setSelectedDiscount(discount);
    setShowDeleteModal(true);
  };

  const createDiscountCodeMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(
        `/product/api/create-discount-code`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-discount"] });
      reset();
      setShowModal(false);
      toast.success("Discount code created successfully");
    },
    onError: () => {
      toast.error("Failed to create discount code");
    },
  });

  const deleteDiscountCodeMutation = useMutation({
    mutationFn: async (discountId) => {
      const response = await axiosInstance.delete(`/product/api/delete-discount-code/${discountId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-discount"] });
      setShowDeleteModal(false);
      toast.success("Discount code deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete discount code");
    },
  });

  const onSubmit = (data: any) => {
    if (discountCodes.length >= 8) {
      toast.error("You can only create 8 discount codes");
      return;
    }
    createDiscountCodeMutation.mutate(data);
  };

  const {
    data: discountCodes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["shop-discount"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/product/api/get-discount-codes`
      );
      console.log("API Response:", response?.data);
      return response?.data?.discountCode || [];
    },
  });

  return (
    <div className="w-full min-h-screen p-8">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl font-semibold text-white">Discount Codes</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Create Discount Code
        </button>
      </div>
      {/* {breadcrumbs} */}
      <div className="flex items-center">
        <Link href="/dashboard" className="text-[#80Deea] cursor-pointer ">
          Dashboard
        </Link>
        <ChevronRight size={20} color="white" className="opacity-[.8]" />
        <Link
          href="/dashboard/discount-codes"
          className=" text-white cursor-pointer "
        >
          Discount Codes
        </Link>
      </div>

      <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
        <h3 className="text-white text-lg mb-4 font-semibold">
          Your Discount Codes
        </h3>

        {isLoading ? (
          <p className="text-gray-400 text-center">
            <Loader2 className="animate-spin text-white" size={20} />
          </p>
        ) : (
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Value</th>
                <th className="text-left p-3">Code</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discountCodes?.map((discount: any) => (
                <tr
                  key={discount?.id}
                  className="border-b border-gray-800 hover:bg-gray-800 transition"
                >
                  <td className="p-3">{discount?.public_name}</td>
                  <td className="p-3">
                    {discount?.discountType === "percentage" ? "Percentage" : "Flat Amount"}
                  </td>
                  <td className="p-3">
                    {discount?.discountType === "percentage"
                      ? `${discount.discountValue}%`
                      : `$${discount.discountValue}`}
                  </td>
                  <td className="p-3">{discount?.discountCode}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(discount)}
                      className="hover:bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      <Trash size={18} />
                      
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!isLoading && discountCodes?.length === 0 && (
          <p className="text-gray-400 text-center mt-4">
            No discount codes found
          </p>
        )}
      </div>

      {/* create discount code modal */}
      {showModal && (
        <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 w-[450px] rounded-lg shadow-lg">
            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
              <h3 className="text-white text-xl ">Create Discount Code</h3>
              <button
                onClick={() => setShowModal(false)}
                className=" text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                className="bg-gray-700"
                label="Title (public name)"
                {...register("public_name", { required: "title is required" })}
              />
              {errors.public_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.public_name.message}
                </p>
              )}

              <div className="mt-2">
                <label className="block text-gray-300 mb-1 font-semibold">
                  Discount Type
                </label>
                <Controller
                  control={control}
                  name="discountType"
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="flat">Flat Amount (USD)</option>
                    </select>
                  )}
                />
              </div>

              <div className="mt-2">
                <Input
                  type="number"
                  min={1}
                  className="bg-gray-700"
                  label="Discount Value"
                  {...register("discountValue", {
                    required: "discount value is required",
                  })}
                />
                {errors.discountValue && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.discountValue.message}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  className="bg-gray-700"
                  label="Discount Code"
                  {...register("discountCode", {
                    required: "discount code is required",
                  })}
                />
                {errors.discountCode && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.discountCode.message}
                  </p>
                )}
              </div>

              <button
                disabled={createDiscountCodeMutation.isPending}
                type="submit"
                className="bg-green-700 w-full mt-4 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                {createDiscountCodeMutation.isPending ? (
                  <RectangularLoader />
                ) : (
                  "Create Discount Code"
                )}
              </button>
              {createDiscountCodeMutation.isError && (
                <p className="text-red-500 text-xs mt-1">
                  {(
                    createDiscountCodeMutation.error as AxiosError<{
                      message: string;
                    }>
                  )?.response?.data?.message ||
                    "Failed to create discount code"}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* delete discount code modal */}
      {showDeleteModal && selectedDiscount && (
        <DeleteDiscountCodeModal
         discount={selectedDiscount}
         onClose={(e:boolean)=>setShowDeleteModal(e)}
         onConfirm={()=>deleteDiscountCodeMutation.mutate(selectedDiscount?.id)}
         />
      )}
    </div>
  );
};

export default page;
