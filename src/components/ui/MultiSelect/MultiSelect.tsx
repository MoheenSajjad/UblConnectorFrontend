import { CloseIcon, CloseMiniIcon } from "@/components/icons/close-icon";
import React from "react";
import { IconButton } from "../IconButton";
import { Input } from "../input";

interface SelectTriggerProps {
  isOpen: boolean;
  toggleDropdown: () => void;
  selectedItems: string[];
  placeholder: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSelection: () => void;
  isMulti: boolean;
  className?: string;
  disabled?: boolean;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  isOpen,
  toggleDropdown,
  selectedItems,
  placeholder,
  onSearchChange,
  clearSelection,
  isMulti,
  className,
  disabled = false,
}) => (
  <div
    className={`flex items-center justify-between border border-gray-300 rounded-lg p-2 mb-5 ${className} ${
      disabled && "bg-gray-300 cursor-wait"
    } cursor-pointer`}
    onClick={!disabled ? toggleDropdown : () => {}}
  >
    <SelectValue
      selectedItems={selectedItems}
      placeholder={placeholder}
      isMulti={isMulti}
    />

    <IconButton
      isSmall
      onClick={() => clearSelection()}
      icon={
        <CloseMiniIcon className="cursor-pointer text-gray-300  transition-all duration-300 ease-in-out" />
      }
      className="h-[10px] w-[18px] hover:bg-white"
    />
  </div>
);

interface SelectValueProps {
  selectedItems: string[];
  placeholder: string;
  isMulti: boolean;
}

export const SelectValue: React.FC<SelectValueProps> = ({
  selectedItems,
  placeholder,
  isMulti,
}) => {
  if (
    selectedItems.length === 0 ||
    (selectedItems.length === 1 && !selectedItems[0])
  ) {
    return <span className="whitespace-nowrap">{placeholder}</span>;
  }

  if (isMulti && selectedItems.length > 2) {
    return (
      <span className="whitespace-nowrap">
        {selectedItems.length} items selected
      </span>
    );
  }

  return (
    <span className="whitespace-nowrap">
      {isMulti ? selectedItems.join(", ") : selectedItems[0]}
    </span>
  );
};

export const SelectContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div
    className={`absolute  w-full bg-white border rounded-md mt-1 top-16 max-h-60 overflow-y-auto z-10 ${className}`}
  >
    {children}
  </div>
);

export const SelectGroup: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="py-1 px-1 ">{children}</div>;

interface SelectItemProps {
  value: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

export const SelectItem: React.FC<SelectItemProps> = ({
  value,
  isSelected,
  onClick,
  className,
}) => (
  <div
    className={`p-2 rounded-md cursor-pointer mb-[2px] ${
      isSelected ? "bg-blue-200" : "hover:bg-gray-100"
    } ${className}`}
    onClick={onClick}
  >
    {value}
  </div>
);

export const SelectLabel: React.FC<{ label: string; isRequired?: boolean }> = ({
  label,
  isRequired = false,
}) => <Input.Label value={label} isRequired={isRequired} />;

interface SelectInputProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  searchTerm,
  onSearchChange,
}) => (
  <input
    className="w-full p-2 border-b focus:outline-none"
    type="text"
    placeholder="Search..."
    value={searchTerm}
    onChange={onSearchChange}
  />
);
