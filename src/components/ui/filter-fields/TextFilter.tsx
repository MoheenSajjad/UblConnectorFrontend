import React from "react";
import { TextFilterProps } from "@/types/filter";
import { Input } from "../input";

export const TextFilter: React.FC<TextFilterProps> = ({
  label,
  value,
  placeholder = "",
  onChange,
  className = "",
}) => {
  return (
    <div className={`filter-group ${className}`}>
      {label && <Input.Label value={label} />}
      <div className="relative">
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full pl-2 pr-3 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none  focus:border-blue-500 text-sm"
        />
      </div>
    </div>
  );
};
