import React from "react";
import { TextFilterProps } from "@/types/filter";

export const TextFilter: React.FC<TextFilterProps> = ({
  label,

  placeholder = "",
  onChange,
  className = "",
}) => {
  return (
    <div className={`filter-group ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full pl-2 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>
    </div>
  );
};
