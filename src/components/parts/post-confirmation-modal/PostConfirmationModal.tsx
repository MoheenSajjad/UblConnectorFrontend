import React, { useState } from "react";

interface PostConfirmationModalParams {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
export const PostConfirmationModal = ({
  isOpen,
  onConfirm,
  onCancel,
}: PostConfirmationModalParams) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
        {/* Warning Icon SVG */}
        <div className="flex justify-center mb-4">
          <svg
            className="w-16 h-16 text-amber-500"
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
          Confirm Submission
        </h3>

        <p className="text-gray-600 text-center mb-6">
          After posting this data, you will{" "}
          <span className="font-bold">not</span> be able to update it. Are you
          sure you want to proceed?
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
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Yes, Post Data
          </button>
        </div>
      </div>
    </div>
  );
};
