import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import {
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectItem,
  SelectInput,
  SelectLabel,
  SelectEmpty,
} from "@/components/ui/MultiSelect";
import useOutsideClick from "@/hooks/use-outside-click/use-outside-click";
import { useFetch } from "@/hooks/use-fetch";
import { BusinnessPartner } from "@/types/sap";
import { getBusinessPartners } from "@/services/sapService";
import { useParams } from "react-router-dom";

interface SelectProps {
  isMulti?: boolean;
  placeholder?: string;
  selectedItem: string | null;
  onSelect: (item: BusinnessPartner) => void;
  clearSelection: () => void;
  isDisabeld?: boolean;
}

export const BusinessPartnerDropdown: React.FC<SelectProps> = ({
  isMulti = false,
  placeholder = "Select...",
  selectedItem,
  onSelect,
  clearSelection,
  isDisabeld = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { id } = useParams();

  const fetchPartners = useCallback(() => getBusinessPartners(id), [id]);

  const { data: partners, isLoading } = useFetch<BusinnessPartner[]>(
    fetchPartners,
    { autoFetch: true }
  );

  const toggleSelected = (item: BusinnessPartner) => {
    onSelect(item);
  };

  const filteredPartners = (partners || []).filter(
    (item) =>
      item.CardCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.CardName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayItems = (partners || [])
    .filter((item) => selectedItem?.includes(item.CardCode))
    .map((item) => item.CardName);

  const handleOutsideClick = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  const dropdownRef = useOutsideClick<HTMLDivElement>(handleOutsideClick);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <SelectLabel label="Business Partners" isRequired />
      <SelectTrigger
        isOpen={isOpen}
        toggleDropdown={() => setIsOpen(!isOpen)}
        selectedItems={displayItems}
        placeholder={isLoading ? "Loading..." : placeholder}
        onSearchChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
        clearSelection={clearSelection}
        isMulti={isMulti}
        disabled={isLoading || isDisabeld}
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
            {filteredPartners?.length > 0 ? (
              filteredPartners.map((item) => (
                <SelectItem
                  key={item.CardCode}
                  value={`${item.CardName}`}
                  isSelected={selectedItem?.includes(item.CardCode) ?? false}
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
