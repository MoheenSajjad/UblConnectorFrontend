import React, { ChangeEvent, useCallback, useState } from "react";
import {
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectItem,
  SelectInput,
} from "@/components/ui/MultiSelect";
import useOutsideClick from "@/hooks/use-outside-click/use-outside-click";
import { OrderCode } from "@/types/sap";

interface SelectProps {
  isMulti?: boolean;
  placeholder?: string;
  options: OrderCode[];
  selectedItem: string | null;
  onSelect: (item: OrderCode) => void;
  clearSelection: () => void;
  isDisabled?: boolean;
}

export const PurchaseOrderCodeDropdown: React.FC<SelectProps> = ({
  isMulti = false,
  placeholder = "Select...",
  selectedItem,
  onSelect,
  clearSelection,
  options,
  isDisabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSelected = (item: OrderCode) => {
    onSelect(item);
  };

  const filteredPartners = options?.filter(
    (item) =>
      item.CardCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.CardName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayItems = options
    ?.filter((item) => selectedItem?.includes(item.CardCode))
    .map((item) => item.CardName);

  const handleOutsideClick = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  const dropdownRef = useOutsideClick<HTMLDivElement>(handleOutsideClick);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <SelectTrigger
        className="p-[6px] text-sm mb-[0px] rounded-md border-gray-200"
        isOpen={isOpen}
        toggleDropdown={() => setIsOpen(!isOpen)}
        selectedItems={displayItems}
        placeholder={placeholder}
        onSearchChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
        clearSelection={clearSelection}
        isMulti={isMulti}
        disabled={isDisabled}
      />
      {isOpen && (
        <SelectContent className="top-8">
          <SelectInput
            searchTerm={searchTerm}
            onSearchChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
          />
          <SelectGroup>
            {filteredPartners.map((item) => (
              <SelectItem
                key={item.CardCode}
                value={`${item.CardName} - ${item.CardCode}`}
                isSelected={selectedItem?.includes(item.CardCode) ?? false}
                onClick={() => toggleSelected(item)}
                className="p-1 whitespace-nowrap"
              />
            ))}
          </SelectGroup>
        </SelectContent>
      )}
    </div>
  );
};
