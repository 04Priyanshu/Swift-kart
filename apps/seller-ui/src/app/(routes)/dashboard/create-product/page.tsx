"use client";
import ImagePlaceHolder from "apps/seller-ui/src/shared/components/image-placeholder";
import axios from "axios";
import { ChevronRight } from "lucide-react";
import ColorSelector from "packages/components/color-selector";
import CustomSpecification from "packages/components/custom-specification";
import CustomProperties from "packages/components/cutom-properties";
import Input from "packages/components/input";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import RichTextEditor from "packages/components/rich-text-editor";
import { SizeSelector } from "packages/components/size-selector";

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
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [loading, setLoading] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/product/api/get-categories`
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const categories = data?.categories || [];
  const subCategories = data?.subCategories || {};

  const selectedCategory = watch("category");
  const regularPrice = watch("regular_price");

  const subCategoriesData = useMemo(()=>{
    return selectedCategory ? subCategories[selectedCategory] || [] : [];
  },[selectedCategory,subCategories])


  const handleImageChange = (file: File | null, index: number) => {
    const updatedImages = [...images];
    updatedImages[index] = file;
    if (index === images.length - 1 && images.length < 8) {
      updatedImages.push(null);
    }
    setImages(updatedImages);
    setValue("images", updatedImages);
  };

  const handleSaveDraft = () => {

  }

  const handleImageRemove = (index: number) => {
    setImages((prevImages) => {
      let updatedImages = [...prevImages];

      if (index === -1) {
        updatedImages[0] = null;
      } else {
        updatedImages.splice(index, 1);
      }

      if (updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }
      return updatedImages;
    });
    setValue("images", images);
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
        <span className="text-[#80Deea] cursor-pointer ">Dashboard</span>
        <ChevronRight size={20} className="opacity-[.8]" />
        <span className=" cursor-pointer ">Create Product</span>
      </div>

      {/* content layout */}
      <div className="py-4 w-full flex gap-6">
        {/* left side image upload */}

        <div className="md:w-[35%]">
          {images?.length > 0 && (
            <ImagePlaceHolder
              setOpenImageModal={setOpenImageModal}
              size="765 x 850"
              small={false}
              onImageChange={handleImageChange}
              onRemove={handleImageRemove}
              defaultImage={null}
              index={0}
            />
          )}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {images?.slice(1)?.map((_, index) => (
              <ImagePlaceHolder
                setOpenImageModal={setOpenImageModal}
                key={index}
                size="300 x 300"
                small={true}
                onImageChange={handleImageChange}
                onRemove={handleImageRemove}
                defaultImage={null}
                index={index + 1}
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
                  label="Product Description"
                  className="border-gray-700 bg-gray-900"
                  rows={7}
                  cols={10}
                  placeholder="Enter Product Description"
                  {...register("description", {
                    required: "Product Description is required",
                    validate: (value) => {
                      const wordCount = value.trim().split(/\s+/).length;
                      return (
                        wordCount <= 150 ||
                        `Description must be at least 150 words(Current: ${wordCount})`
                      );
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message as string}
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
                  name="sub_category"
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
                {errors.sub_category && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.sub_category.message as string}
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
                rules={{required:"Detailed Description is required" ,
                validate: (value) => {
                  const wordCount = value?.split(/\s+/).filter((word : string)=> word).length;
                  return wordCount >= 100 || `Detailed Description must be at least 100 words(Current: ${wordCount})`;
                }
                }}
                render={({field})=>(
                  <RichTextEditor value={field.value} onChange={field.onChange}/>
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
                label = "Video URL"
                placeholder="https://www.youtube.com/embed/dQw4w"
                className="border-gray-700 bg-gray-900"
                {...register("video_url",{
                  pattern: {
                    value: /^(https?:\/\/)?(www\.)?(youtube\.com\/embed\/[a-zA-Z0-9_-]+)$/,
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
                />
              </div>

              <div className="mt-2">
                <Input
                label="Sale Price"
                placeholder="19$"
                className="border-gray-700 bg-gray-900"
                {...register("sale_price",{
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
                {...register("stock",{
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
                    if(!Number.isInteger(value)){
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
                <SizeSelector control={control} errors={errors}/>
              </div>

              <div className="mt-3">
                <label className="block font-semibold text-gray-300 mb-1">
                  Select Discount Codes(optional)
                </label>
              </div>
            </div>

          </div>
           
        </div>
      </div>

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
