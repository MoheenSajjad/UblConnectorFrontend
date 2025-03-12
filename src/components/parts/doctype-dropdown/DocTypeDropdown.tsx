import React, { useCallback, useState } from "react";
import {
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectItem,
  SelectInput,
  SelectLabel,
} from "@/components/ui/MultiSelect";
import useOutsideClick from "@/hooks/use-outside-click/use-outside-click";

interface DocType {
  id: number;
  value: string;
  name: string;
}

const DocTypeOptions = [
  { id: 1, value: "S", name: "Service" },
  { id: 2, value: "I", name: "Items" },
];

interface SelectProps {
  isMulti?: boolean;
  placeholder?: string;
  selectedItem: string | null;
  onSelect: (item: DocType) => void;
  clearSelection: () => void;
}

export const DocTypeDropdown: React.FC<SelectProps> = ({
  isMulti = false,
  placeholder = "Select...",
  selectedItem,
  onSelect,
  clearSelection,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSelected = (item: DocType) => {
    onSelect(item);
  };

  const displayItems = DocTypeOptions.filter(
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
      <SelectLabel label="Doc Type" isRequired />
      <SelectTrigger
        isOpen={isOpen}
        toggleDropdown={() => setIsOpen(!isOpen)}
        selectedItems={displayItems}
        placeholder={placeholder}
        onSearchChange={() => {}}
        clearSelection={clearSelection}
        isMulti={isMulti}
      />
      {isOpen && (
        <SelectContent>
          <SelectGroup>
            {DocTypeOptions.map((item) => (
              <SelectItem
                key={item.id}
                value={item.name}
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
