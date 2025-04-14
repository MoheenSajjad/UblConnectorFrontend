import React, { ChangeEvent, useState } from "react";
import {
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectItem,
  SelectInput,
  SelectLabel,
} from "@/components/ui/MultiSelect";
import { Company } from "@/types/companies";

interface SelectProps {
  isMulti?: boolean;
  options: Company[];
  placeholder?: string;
  selectedItems: number[];
  onSelect: (item: Company) => void;
  clearSelection: () => void;
  hasError?: boolean;
}

export const CompanyDropdown: React.FC<SelectProps> = ({
  isMulti = false,
  options,
  placeholder = "Select...",
  selectedItems,
  onSelect,
  clearSelection,
  hasError,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSelected = (item: Company) => {
    onSelect(item);
    setIsOpen(false);
  };

  const filteredcompanys = options.filter(
    (company) =>
      company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.companyId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayItems = options
    .filter((item) => selectedItems.includes(item.id))
    .map((item) => item.name);

  return (
    <div className="relative w-full">
      <SelectLabel label="Company" isRequired />
      <SelectTrigger
        isOpen={isOpen}
        toggleDropdown={() => setIsOpen(!isOpen)}
        selectedItems={displayItems}
        placeholder={placeholder}
        onSearchChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
        clearSelection={clearSelection}
        isMulti={isMulti}
        hasError
      />
      {isOpen && (
        <SelectContent>
          <SelectInput
            searchTerm={searchTerm}
            onSearchChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
          />
          <SelectGroup>
            {filteredcompanys.map((company) => (
              <SelectItem
                key={company.companyId}
                value={`${company.name} - ${company.companyId}`}
                isSelected={selectedItems.includes(company.id)}
                onClick={() => toggleSelected(company)}
              />
            ))}
          </SelectGroup>
        </SelectContent>
      )}
    </div>
  );
};
