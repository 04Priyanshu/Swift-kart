import { X } from "lucide-react";
import React from "react";

const DeleteDiscountCodeModal = ({
  discount,
  onClose,
  onConfirm,
}: {
  discount: any;
  onClose: (e: boolean) => void;
  onConfirm: any;
}) => {
  return (
    <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 w-[450px] rounded-lg shadow-lg">
        {/* header */}

        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
            <h3 className="text-white text-xl">Delete Discount Code</h3>
            <button onClick={()=>onClose(false)} className="text-gray-400 hover:text-white">
                <X size={18} />
            </button>
        </div>

        {/* warning message */}
        <p className="text-gray-400 text-sm mt-4">
            Are you sure you want to delete this discount code?
        </p>

        {/* button */}
        <div className="flex justify-end gap-2 mt-4">
            <button onClick={()=>onClose(false)} className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Cancel</button>
            <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDiscountCodeModal;
