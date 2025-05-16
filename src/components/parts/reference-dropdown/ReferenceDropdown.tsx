import React, { ChangeEvent, useCallback, useState } from "react";
import {
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectItem,
  SelectInput,
  SelectLabel,
} from "@/components/ui/MultiSelect";
import useOutsideClick from "@/hooks/use-outside-click/use-outside-click";

interface ReferenceType {
  id: number;
  value: string;
  name: string;
}

const ReferenceOptions = [
  { id: 1, value: "po", name: "Purchase Order" },
  { id: 2, value: "grn", name: "Good Receipt" },
  { id: 3, value: "cost", name: "Cost Invoice" },
];

interface SelectProps {
  isMulti?: boolean;
  placeholder?: string;
  selectedItem: string | null;
  onSelect: (item: ReferenceType) => void;
  clearSelection: () => void;
  isDisabeld?: boolean;
}

export const ReferenceDropdown: React.FC<SelectProps> = ({
  isMulti = false,
  placeholder = "Select...",
  selectedItem,
  onSelect,
  clearSelection,
  isDisabeld = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSelected = (item: ReferenceType) => {
    onSelect(item);
  };

  const displayItems = ReferenceOptions.filter(
    (item) => selectedItem == item.value
  ).map((item) => item.name);

  const handleOutsideClick = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  const dropdownRef = useOutsideClick<HTMLDivElement>(handleOutsideClick);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <SelectLabel label="Reference" isRequired />
      <SelectTrigger
        isOpen={isOpen}
        toggleDropdown={() => setIsOpen(!isOpen)}
        selectedItems={displayItems}
        placeholder={placeholder}
        onSearchChange={() => {}}
        clearSelection={clearSelection}
        isMulti={isMulti}
        disabled={isDisabeld}
      />
      {isOpen && (
        <SelectContent>
          <SelectGroup>
            {ReferenceOptions.map((item) => (
              <SelectItem
                key={item.id}
                value={`${item.name}`}
                isSelected={selectedItem == item.value}
                onClick={() => toggleSelected(item)}
              />
            ))}
          </SelectGroup>
        </SelectContent>
      )}
    </div>
  );
};
