"use client";
import ImagePlaceHolder from "apps/seller-ui/src/shared/components/image-placeholder";
import axiosInstance from "../../../../utils/axiosInstance";
import { ChevronRight, Wand, X } from "lucide-react";
import ColorSelector from "packages/components/color-selector";
import CustomSpecification from "packages/components/custom-specification";
import CustomProperties from "packages/components/cutom-properties";
import Input from "packages/components/input";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import RichTextEditor from "packages/components/rich-text-editor";
import { SizeSelector } from "packages/components/size-selector";
import Link from "next/link";
import Image from "next/image";
import { enhancements } from "apps/seller-ui/src/utils/Ai.enhancment";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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

interface UploadedImage {
  fileId: string;
  file_url: string;
}

const page = () => {
  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [openImageModal, setOpenImageModal] = useState(false);
  const [isChanged, setIsChanged] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [images, setImages] = useState<(UploadedImage | null)[]>([null]);
  const [processing, setProcessing] = useState(false);
  const [activeEnhancement, setActiveEnhancement] = useState("");
  const [loading, setLoading] = useState(false);
  const [removingImageIndex, setRemovingImageIndex] = useState<number | null>(
    null
  );
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/product/api/get-categories`);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const router = useRouter();

  const applyTransformation = async (transformation: string) => {
    if (!selectedImage || processing) return;

    setProcessing(true);
    setActiveEnhancement(transformation);

    try {
      const transformedUrl = `${selectedImage}?tr=${transformation}`;
      setSelectedImage(transformedUrl);
    } catch (error) {
      console.log(error);
    } finally {
      setProcessing(false);
    }
  };

  const { data: discountCodes = [], isLoading: discountCodesLoading } =
    useQuery({
      queryKey: ["shop-discount"],
      queryFn: async () => {
        const response = await axiosInstance.get(
          `/product/api/get-discount-codes`
        );

        return response?.data?.discountCode || [];
      },
    });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/product/api/create-product", data);
      toast.success(response?.data?.message);
      router.push("/dashboard/all-products");
    } catch (error:any) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = data?.categories || [];
  const subCategories = data?.subCategories || {};

  const selectedCategory = watch("category");
  const regularPrice = watch("regular_price");

  const subCategoriesData = useMemo(() => {
    return selectedCategory ? subCategories[selectedCategory] || [] : [];
  }, [selectedCategory, subCategories]);

  const convertFileToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const validateImageFile = (file: File) => {
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error("Image file size must be less than 5MB");
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPEG, PNG, and WebP images are allowed");
    }

    return true;
  };

  const handleImageChange = async (file: File | null, index: number) => {
    if (!file) return;

    try {
      // Validate file before processing
      validateImageFile(file);

      setLoading(true);
      const fileName = await convertFileToBase64(file);

      const response = await axiosInstance.post(
        "/product/api/upload-product-image",
        {
          fileName,
        }
      );

      const uploadedImage: UploadedImage = {
        fileId: response?.data?.fileId,
        file_url: response?.data?.file_url,
      };
      const updatedImages = [...images];
      updatedImages[index] = uploadedImage;

      if (index === images.length - 1 && images.length < 8) {
        updatedImages.push(null);
      }
      setImages(updatedImages);
      setValue("images", updatedImages);
    } catch (error: any) {
      console.error("Image upload error:", error);
      // You can add a toast notification here to show the error to the user
      alert(error.message || "Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {};

  const handleImageRemove = async (index: number) => {
    try {
      setRemovingImageIndex(index);
      const updatedImages = [...images];

      const imageToRemove = updatedImages[index];

      if (imageToRemove && typeof imageToRemove === "object") {
        console.log(imageToRemove);
        //delete out picture from imagekit
        await axiosInstance.delete("/product/api/delete-product-image", {
          data: {
            fileId: imageToRemove?.fileId,
          },
        });
      }

      updatedImages.splice(index, 1);

      // Only add null placeholder if we don't have any null placeholders and we're under the limit
      const hasNullPlaceholder = updatedImages.some((img) => img === null);
      if (!hasNullPlaceholder && updatedImages.length < 8) {
        updatedImages.push(null);
      }

      setImages(updatedImages);
      setValue("images", updatedImages);
    } catch (error) {
      console.log(error);
    } finally {
      setRemovingImageIndex(null);
    }
  };

  return (
    <form
      className="w-full mx-auto p-8 shadow-md rounded-lg text-white"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* headings and breadcrumbs */}

      <h2 className="text-2xl py-2 font-Poppins text-white font-semibold">
        Create Product
      </h2>

      <div className="flex items-center">
        <Link href="/dashboard" className="text-[#80Deea] cursor-pointer ">
          Dashboard
        </Link>
        <ChevronRight size={20} color="white" className="opacity-[.8]" />
        <Link
          href="/dashboard/create-product"
          className=" text-white cursor-pointer "
        >
          Create Product
        </Link>
      </div>

      {/* content layout */}
      <div className="py-4 w-full flex gap-6">
        {/* left side image upload */}

        <div className="md:w-[35%]">
          {loading && (
            <div className="mb-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-md">
              <div className="flex items-center gap-2">
                <RectangularLoader />
                <span className="text-blue-300 text-sm">
                  Uploading image...
                </span>
              </div>
            </div>
          )}

          {removingImageIndex !== null && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-500/30 rounded-md">
              <div className="flex items-center gap-2">
                <RectangularLoader />
                <span className="text-red-300 text-sm">Removing image...</span>
              </div>
            </div>
          )}

          {images?.length > 0 && (
            <ImagePlaceHolder
              setOpenImageModal={setOpenImageModal}
              size="765 x 850"
              small={false}
              onImageChange={handleImageChange}
              setSelectedImage={setSelectedImage}
              onRemove={handleImageRemove}
              images={images}
              defaultImage={images[0]?.file_url || null}
              index={0}
              removingImageIndex={removingImageIndex}
            />
          )}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {images?.slice(1)?.map((image, index) => (
              <ImagePlaceHolder
                setOpenImageModal={setOpenImageModal}
                key={index}
                size="300 x 300"
                small={true}
                onImageChange={handleImageChange}
                setSelectedImage={setSelectedImage}
                images={images}
                onRemove={handleImageRemove}
                defaultImage={image?.file_url || null}
                index={index + 1}
                removingImageIndex={removingImageIndex}
              />
            ))}
          </div>
        </div>

        {/* right side form */}
        <div className="md:w-[65%]">
          <div className="flex w-full gap-6">
            {/* product title input */}
            <div className="w-2/4">
              <Input
                label="Product Title"
                placeholder="Enter Product Title"
                className="border-gray-700 bg-gray-900"
                {...register("title", {
                  required: "Product Title is required",
                })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message as string}
                </p>
              )}

              <div className="mt-2">
                <Input
                  type="textarea"
                  label="Short Description"
                  className="border-gray-700 bg-gray-900"
                  rows={7}
                  cols={10}
                  placeholder="Enter Short Description"
                  {...register("short_description", {
                    required: "Short Description is required",
                    validate: (value) => {
                      const wordCount = value.trim().split(/\s+/).length;
                      return (
                        wordCount <= 150 ||
                        `Description must be at least 150 words(Current: ${wordCount})`
                      );
                    },
                  })}
                />
                {errors.short_description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.short_description.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Tags"
                  placeholder="Enter Product Tags"
                  className="border-gray-700 bg-gray-900"
                  {...register("tags", {
                    required: "Seperate related products tags with comma",
                  })}
                />
                {errors.tags && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.tags.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Warranty *"
                  placeholder="Enter Product Warranty"
                  className="border-gray-700 bg-gray-900"
                  {...register("warranty", {
                    required: "Product Warranty is required",
                  })}
                />
                {errors.warranty && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.warranty.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="slug"
                  className="border-gray-700 bg-gray-900"
                  placeholder="Enter Product Slug"
                  {...register("slug", {
                    required: "Product Slug is required",
                    pattern: {
                      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message:
                        "Slug must be in lowercase and can only contain letters, numbers, and hyphens",
                    },
                    minLength: {
                      value: 3,
                      message: "Slug must be at least 3 characters long",
                    },
                    maxLength: {
                      value: 50,
                      message: "Slug must be at most 50 characters long",
                    },
                  })}
                />
                {errors.slug && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.slug.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Brand"
                  placeholder="Enter Product Brand"
                  className="border-gray-700 bg-gray-900"
                  {...register("brand", {
                    required: "Product Brand is required",
                  })}
                />
                {errors.brand && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.brand.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <ColorSelector control={control} errors={errors} />
              </div>

              <div className="mt-2">
                <CustomSpecification control={control} errors={errors} />
              </div>

              <div className="mt-2">
                <CustomProperties control={control} errors={errors} />
              </div>

              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Cash on Delivery
                </label>
                <select
                  {...register("cash_on_delivery", {
                    required: "Cash on Delivery is required",
                  })}
                  defaultValue="yes"
                  className="w-full border outline-none border-gray-700 bg-gray-900 rounded-md p-2 text-white"
                >
                  <option value="yes" className="bg-gray-900">
                    Yes
                  </option>
                  <option value="no" className="bg-gray-900">
                    No
                  </option>
                </select>
                {errors.cash_on_delivery && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cash_on_delivery.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="w-2/4">
              <label className="block font-semibold text-gray-300 mb-1">
                {" "}
                Category
              </label>
              {isLoading ? (
                <RectangularLoader />
              ) : isError ? (
                <p className="text-red-500 text-sm mt-1">
                  Failed to load categories
                </p>
              ) : (
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border outline-none border-gray-700 bg-gray-900 rounded-md p-2 text-white"
                    >
                      {" "}
                      <option value="" className="bg-black">
                        Select Category
                      </option>
                      {categories.map((category: string) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-black"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  )}
                />
              )}
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message as string}
                </p>
              )}

              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Sub Category
                </label>
                <Controller
                  name="subCategory"
                  control={control}
                  rules={{ required: "Sub Category is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border outline-none border-gray-700 bg-gray-900 rounded-md p-2 text-white"
                    >
                      {" "}
                      <option value="" className="bg-black">
                        Select Sub Category
                      </option>
                      {subCategoriesData.map((subCategory: string) => (
                        <option
                          key={subCategory}
                          value={subCategory}
                          className="bg-black"
                        >
                          {subCategory}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.subCategory && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subCategory.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Detailed Description (Min 100 words)
                </label>
                <Controller
                  name="detailed_description"
                  control={control}
                  rules={{
                    required: "Detailed Description is required",
                    validate: (value) => {
                      const wordCount = value
                        ?.split(/\s+/)
                        .filter((word: string) => word).length;
                      return (
                        wordCount >= 100 ||
                        `Detailed Description must be at least 100 words(Current: ${wordCount})`
                      );
                    },
                  }}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.detailed_description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.detailed_description.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Video URL"
                  placeholder="https://www.youtube.com/embed/dQw4w"
                  className="border-gray-700 bg-gray-900"
                  {...register("video_url", {
                    pattern: {
                      value:
                        /^(https?:\/\/)?(www\.)?(youtube\.com\/embed\/[a-zA-Z0-9_-]+)$/,
                      message: "Invalid YouTube Embed URL",
                    },
                  })}
                />
                {errors.video_url && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.video_url.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Regular Price
                </label>
                <Input
                  type="number"
                  className="border-gray-700 bg-gray-900"
                  placeholder="21$"
                  {...register("regular_price", {
                    required: "Regular Price is required",
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Regular Price must be greater than 0",
                    },
                  })}
                />
              </div>


              <div className="mt-2">
                <Input
                  label="Sale Price"
                  placeholder="19$"
                  className="border-gray-700 bg-gray-900"
                  {...register("sale_price", {
                    required: "Sale Price is required",
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Sale Price must be greater than 0",
                    },
                    validate: (value) => {
                      if (isNaN(value)) {
                        return "Sale Price must be a number";
                      }
                      if (regularPrice && value >= regularPrice) {
                        return "Sale Price must be less than Regular Price";
                      }
                      return true;
                    },
                  })}
                />
                {errors.sale_price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.sale_price.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Stock"
                  placeholder="100"
                  className="border-gray-700 bg-gray-900"
                  {...register("stock", {
                    required: "Stock is required",
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Stock must be at least 1",
                    },
                    max: {
                      value: 1000,
                      message: "Stock must be less than 1000",
                    },
                    validate: (value) => {
                      if (isNaN(value)) {
                        return "Stock must be a number";
                      }
                      if (!Number.isInteger(value)) {
                        return "Stock must be an integer";
                      }
                      return true;
                    },
                  })}
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.stock.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <SizeSelector control={control} errors={errors} />
              </div>

              <div className="mt-3">
                <label className="block font-semibold text-gray-300 mb-1">
                  Select Discount Codes(optional)
                </label>
                {discountCodesLoading ? (
                  <RectangularLoader />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {discountCodes.map((code: any) => (
                      <button
                        onClick={() => {
                          const currentSelection = watch("discountCodes") || [];
                          const updatedSelection = currentSelection.includes(
                            code?.id
                          )
                            ? currentSelection.filter(
                                (id: string) => id !== code?.id
                              )
                            : [...currentSelection, code?.id];
                          setValue("discountCodes", updatedSelection);
                        }}
                        type="button"
                        key={code?.id}
                        className={`px-3 py-1 rounded-md text-sm font-semibold border ${
                          watch("discountCodes")?.includes(code?.id)
                            ? "bg-green-500 text-white"
                            : "bg-gray-900 text-white"
                        }`}
                      >
                        {code?.public_name}({code?.discountValue}
                        {code?.discountType === "percentage" ? "%" : "$"})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {openImageModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-blac k bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-[450px] text-white">
            <div className="flex justify-between items-between pb-3 mb-4">
              <h2 className="text-lg font-semibold">Enhance Image</h2>
              <X
                size={20}
                onClick={() => setOpenImageModal(false)}
                className="cursor-pointer"
              />
            </div>

            <div className="relative w-full h-[250px] rounded-md overflow-hidden border border-gray-600">
              <Image
                src={selectedImage}
                alt="product-image"
                height={250}
                width={450}
                className="w-full h-full object-cover"
                quality={100}
                unoptimized={false}
                placeholder="empty"
              />
            </div>
            {selectedImage && (
              <div className="mt-4 space-y-2">
                <h3 className="text-white text-sm font-semibold">
                  AI Enhancements
                </h3>
                <div className="grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto">
                  {enhancements.map(({ label, effect }) => (
                    <button
                      key={effect}
                      className={` p-8 flex items-center gap-2 rounded-md ${
                        activeEnhancement === effect
                          ? "bg-green-500 text-white"
                          : "bg-gray-700 hover:bg-gray-900"
                      }`}
                      onClick={() => applyTransformation(effect)}
                      disabled={processing}
                    >
                      <Wand size={20} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        {isChanged && (
          <button
            type="button"
            className="bg-gray-700 text-white px-4 py-2 rounded-md"
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>
        )}
        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded-md"
        >
          {isLoading ? <RectangularLoader /> : "Save Product"}
        </button>
      </div>
    </form>
  );
};

export default page;
