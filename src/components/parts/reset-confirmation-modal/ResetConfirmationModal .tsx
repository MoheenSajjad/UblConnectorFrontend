import { Loading } from "@/components/ui/Loading";
import React from "react";

interface ResetConfirmationModalParams {
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ResetConfirmationModal = ({
  isOpen,
  isLoading,
  onConfirm,
  onCancel,
}: ResetConfirmationModalParams) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
        {/* Warning Icon */}
        <Loading isLoading={isLoading}>
          <div className="flex justify-center mb-4">
            <svg
              className="w-16 h-16 text-red-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 8V12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
          </div>

          {/* Modal Content */}
          <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
            Reset All Data?
          </h3>

          <p className="text-gray-600 text-center mb-6">
            This will <span className="font-bold">remove all data</span> you’ve
            saved so far. Are you sure you want to reset?
          </p>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Yes, Reset Data
            </button>
          </div>
        </Loading>
      </div>
    </div>
  );
};
