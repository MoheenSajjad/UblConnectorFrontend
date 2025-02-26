import React, { ChangeEvent, useCallback, useState } from "react";
import {
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectItem,
  SelectInput,
  SelectLabel,
} from "@/components/ui/MultiSelect";
import { Company } from "@/types/companies";
import useOutsideClick from "@/hooks/use-outside-click/use-outside-click";

const BusinnessPartnerOptions = [
  {
    CardCode: "A12100403",
    CardName: "Abdulbasir Asghar ",
  },
  {
    CardCode: "A22101347",
    CardName: "Abdullah Ahmed ",
  },
  {
    CardCode: "A11800742",
    CardName: "Abdullah Fakhir ",
  },
  {
    CardCode: "A12001161",
    CardName: "Abdullah Khairy ",
  },
  {
    CardCode: "A11901065",
    CardName: "Abdullah Sakvan ",
  },
  {
    CardCode: "A12100018",
    CardName: "Abdullah Samir ",
  },
  {
    CardCode: "A12100263",
    CardName: "Abdulmalek Asem ",
  },
  {
    CardCode: "A11700659",
    CardName: "Abdulqader Ali ",
  },
];

interface businnessPartner {
  CardCode: string;
  CardName: string;
}

interface SelectProps {
  isMulti?: boolean;
  placeholder?: string;
  selectedItem: string | null;
  onSelect: (item: businnessPartner) => void;
  clearSelection: () => void;
}

export const OrderCodeDropdown: React.FC<SelectProps> = ({
  isMulti = false,
  placeholder = "Select...",
  selectedItem,
  onSelect,
  clearSelection,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSelected = (item: businnessPartner) => {
    onSelect(item);
  };

  const filteredPartners = BusinnessPartnerOptions.filter(
    (item) =>
      item.CardCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.CardName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayItems = BusinnessPartnerOptions.filter((item) =>
    selectedItem?.includes(item.CardCode)
  ).map((item) => item.CardName);

  const handleOutsideClick = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  const dropdownRef = useOutsideClick<HTMLDivElement>(handleOutsideClick);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <SelectTrigger
        className="p-[6px] text-sm mb-0 rounded-md border-gray-200"
        isOpen={isOpen}
        toggleDropdown={() => setIsOpen(!isOpen)}
        selectedItems={displayItems}
        placeholder={placeholder}
        onSearchChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
        clearSelection={clearSelection}
        isMulti={isMulti}
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
                value={`${item.CardName}`}
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
