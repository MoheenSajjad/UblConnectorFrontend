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
import { IChartOfAccount } from "@/types/sap";

interface SelectProps {
  accounts: IChartOfAccount[]; // Passed from parent
  isMulti?: boolean;
  placeholder?: string;
  selectedItem: string | null;
  onSelect: (item: IChartOfAccount) => void;
  clearSelection: () => void;
  isDisabled?: boolean;
}

export const ChartOfAccountDropdown: React.FC<SelectProps> = ({
  accounts,
  isMulti = false,
  placeholder = "Select G/L Account...",
  selectedItem,
  onSelect,
  clearSelection,
  isDisabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSelected = (item: IChartOfAccount) => {
    onSelect(item);
  };

  const filteredAccounts = accounts?.filter(
    (account) =>
      account?.Code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account?.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayItems = accounts
    ?.filter((account) => selectedItem === account.Code)
    .map((account) => `${account.Name} - ${account.Code}`);

  const handleOutsideClick = useCallback(() => {
    if (isOpen) setIsOpen(false);
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
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account) => (
                <SelectItem
                  key={account.Code}
                  value={`${account.Name} - ${account.Code}`}
                  isSelected={selectedItem === account.Code}
                  onClick={() => toggleSelected(account)}
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
