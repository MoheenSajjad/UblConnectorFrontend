import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  type?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  type = "text",
  className = "",
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
