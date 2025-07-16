import React from "react";
import { Controller, useFieldArray } from "react-hook-form";
import Input from "../input";
import { Plus, PlusCircle, Trash2 } from "lucide-react";

const CustomSpecification = ({ control, errors }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "custom_specifications",
  });

  return (
    <div>
      <label className="block font-semibold text-gray-300 mb-1">
        Custom Specifications
      </label>

      <div className="flex flex-col gap-3">
        {fields.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <Controller
              name={`custom_specifications.${index}.name`}
              control={control}
              rules={{ required: "Specification name is required" }}
              render={({ field }) => (
                <Input
                  label="Specification Name"
                  className="border-gray-700 bg-gray-900"
                  placeholder={"eg. Color, Size, etc."}
                  {...field}
                />
              )}
            />

            <Controller
              name={`custom_specifications.${index}.value`}
              control={control}
              rules={{ required: "Specification value is required" }}
              render={({ field }) => (
                <Input label="value" className="border-gray-700 bg-gray-900" placeholder="eg. 4000mAh, 1.5kg, etc." {...field} />
              )}
            />
            <button type="button" onClick={()=>remove(index)} className="text-red-500 hover:text-red-700">
              <Trash2 size={20} />
            </button>
          </div>
        ))}

<button type="button" onClick={()=>append({name:"",value:""})} className="text-green-500 hover:text-green-700 flex items-center cursor-pointer gap-2">
  <PlusCircle size={20} />Add Specification
</button>

      </div>
      {errors.custom_specifications && (
        <p className="text-red-500 text-sm mt-1">
          {errors.custom_specifications.message as string}
        </p>
      )}
    </div>
  );
};

export default CustomSpecification;
