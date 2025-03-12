import React, { ChangeEvent, useCallback, useState } from "react";
import {
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectItem,
  SelectInput,
  SelectEmpty,
} from "@/components/ui/MultiSelect";
import useOutsideClick from "@/hooks/use-outside-click/use-outside-click";
import { VatGroup } from "@/types/sap";

interface SelectProps {
  isMulti?: boolean;
  placeholder?: string;
  options: VatGroup[];
  selectedItem: string | null;
  onSelect: (item: VatGroup) => void;
  clearSelection: () => void;
  isDisabled?: boolean;
}

export const VATGroupDropdown: React.FC<SelectProps> = ({
  isMulti = false,
  placeholder = "Select VAT Group...",
  selectedItem,
  onSelect,
  clearSelection,
  options,
  isDisabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSelected = (item: VatGroup) => {
    onSelect(item);
  };

  const filteredGroups = options?.filter((item) =>
    item.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayItems = options
    ?.filter((item) => selectedItem?.includes(item.Code))
    .map((item) => item.Name);

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
            {filteredGroups?.length > 0 ? (
              filteredGroups.map((item) => (
                <SelectItem
                  key={item.Code}
                  value={`${item.Name} - ${item.Code}`}
                  isSelected={selectedItem?.includes(item.Code) ?? false}
                  onClick={() => toggleSelected(item)}
                  className="p-1 whitespace-nowrap"
                />
              ))
            ) : (
              <SelectEmpty />
            )}
          </SelectGroup>
        </SelectContent>
      )}
    </div>
  );
};
