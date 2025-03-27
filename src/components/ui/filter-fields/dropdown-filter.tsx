import React from "react";
import { DropdownFilterProps } from "@/types/filter";
import { Input } from "../input";
import { ChevronDownIcon } from "@/components/icons";

export const DropdownFilter: React.FC<DropdownFilterProps> = ({
  label,
  options,
  value,
  onChange,
  className = "",
  isDisabled,
}) => {
  return (
    <div className={`filter-group ${className}`}>
      {label && <Input.Label value={label} />}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled}
          className="block w-full pl-3 pr-10 py-1 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none hover:border-blue-500 focus:border-blue-500 text-sm appearance-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDownIcon />
        </div>
      </div>
    </div>
  );
};
