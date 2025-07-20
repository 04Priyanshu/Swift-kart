import { X } from "lucide-react";
import React from "react";

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

const DeleteConfirmationModal = ({
  product,
  onClose,
  onConfirm,
  onRestore,
  isLoading = false,
}: any) => {
  return (
    <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg p-6 w-[450px] shadow-lg">
        {/* header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
          <h3 className="text-xl text-white">Delete Product</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={22} />
          </button>
        </div>

        {/* body */}

        <p className="text-gray-300 mt-4">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-blue-400">{product.title}</span>?
          <br />
        
                    This product will be moved to <span className="font-semibold text-red-500">delete </span>state and permanently deleted after <span className="font-semibold text-blue-500">24 hours</span>.
        </p>


        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          
          <button 
            onClick={!product?.isDeleted? onConfirm:onRestore} 
            disabled={isLoading}
            className={`${!product?.isDeleted ? "bg-red-600 hover:bg-red-500" : "bg-green-600 hover:bg-green-500"} text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            {isLoading ? (
              <>
                <RectangularLoader />
                {/* {product?.isDeleted ? "Restoring..." : "Deleting..."} */}
              </>
            ) : (
              product?.isDeleted ? "Restore" : "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
