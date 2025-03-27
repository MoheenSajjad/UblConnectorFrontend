import React, { useState } from "react";
import {
  Popover,
  PopoverHeader,
  PopoverContent,
  PopoverFooter,
} from "@/components/ui/popover";
import { Grid } from "@/components/ui/grid";
import { TextFilter } from "@/components/ui/filter-fields/TextFilter";
import DropdownFilter from "@/components/ui/filter-fields/dropdown-filter";
import DateRangeFilter from "@/components/ui/filter-fields/date-range";

export type FilterType =
  | "text"
  | "select"
  | "date"
  | "checkbox"
  | "radio"
  | "dateRange";

export interface FilterOption {
  key: string;
  placeholder?: string;
  label: string;
  type: FilterType;
  options?: { label: string; value: string }[]; // For select & radio
}

interface FilterModalProps {
  filtersConfig: FilterOption[];
  onSubmit: (filters: Record<string, any>) => void;
  onReset?: () => void;
  defaultValues?: Record<string, any>;
  buttonText?: string;
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  filtersConfig,
  onSubmit,
  onReset,
  defaultValues = {},
  buttonText = "Open Filters",
  onClose,
}) => {
  const [filters, setFilters] = useState<Record<string, any>>(defaultValues);

  const handleChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters(defaultValues);
    if (onReset) onReset();
  };

  return (
    <>
      <Popover size={Popover.Size.MEDIUM}>
        <PopoverHeader onClose={onClose}>Apply Filters</PopoverHeader>
        <PopoverContent>
          <Grid className="gap-y-5">
            {filtersConfig.map((filter) => (
              <>
                {filter.type === "text" && (
                  <Grid.Cell size={Grid.CellSize.S3} className="w-full">
                    <TextFilter
                      className="w-full"
                      label={filter.label}
                      value=""
                      placeholder={filter.placeholder ?? ""}
                      onChange={() => {}}
                    />
                  </Grid.Cell>
                )}
                {filter.type === "select" && (
                  <Grid.Cell size={Grid.CellSize.S3} className="w-full">
                    <DropdownFilter
                      label={filter.label}
                      className="w-full"
                      options={filter.options ?? []}
                      onChange={(value) =>
                        setFilters({ ...filters, category: value })
                      }
                    />
                  </Grid.Cell>
                )}
                {filter.type === "text" && (
                  <DateRangeFilter
                    label={filter.label}
                    startName="startDate"
                    endName="endDate"
                    startValue={filters.startDate}
                    endValue={filters.endDate}
                    onChange={(start, end) =>
                      setFilters({ ...filters, startDate: start, endDate: end })
                    }
                    className="col-span-1 md:col-span-2"
                  />
                )}
              </>
            ))}
          </Grid>
        </PopoverContent>
        <PopoverFooter>
          <button>dsa</button>
        </PopoverFooter>
      </Popover>
    </>
  );
};
