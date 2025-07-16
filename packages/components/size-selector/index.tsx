import { Controller } from "react-hook-form";

const size = ["S", "M", "L", "XL", "XXL", "XXXL"];

export const SizeSelector = ({ control, errors }: any) => {
  return (
    <div className="mt-2">
      <label className="block font-semibold text-gray-300 mb-1">Size</label>
      <Controller
        name="sizes"
        control={control}
        render={({ field }) => (
          <div className="flex flex-wrap gap-2">
            {size.map((size) => {
              const isSelected = (field.value || []).includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  className={`px-3 py-1 rounded-lg font-Poppins transition-colors ${
                    isSelected
                      ? "bg-gray-700 text-white border border-[#ffffff66]"
                      : "bg-gray-800 text-gray-300"
                  }`}
                  onClick={() => {
                    field.onChange(
                        isSelected
                        ? field.value.filter((s:string)=>s!==size)
                        : [...(field.value || []),size]
                    );
                  }}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      />
    </div>
  );
};
