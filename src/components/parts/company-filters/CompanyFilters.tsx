import React, { useEffect, useState } from "react";
import { TextFilter } from "@/components/ui/filter-fields";
import { Grid } from "@/components/ui/grid";
import {
  Popover,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
} from "@/components/ui/popover";
import { Button, ButtonVariant } from "@/components/ui/Button";

interface CompanyFilterProps {
  onSubmit: (filters: CompanyFilterState) => void;
  onReset?: () => void;
  onClose: () => void;
  initialFilters?: Partial<CompanyFilterState>;
}

export interface CompanyFilterState {
  companyId: string;
  name: string;
  email: string;
  username: string;
}

export const defaultCompanyFilterState: CompanyFilterState = {
  companyId: "",
  name: "",
  email: "",
  username: "",
};

export const CompanyFilter: React.FC<CompanyFilterProps> = ({
  onSubmit,
  onReset,
  onClose,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<CompanyFilterState>({
    ...defaultCompanyFilterState,
    ...initialFilters,
  });

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...defaultCompanyFilterState,
      ...initialFilters,
    }));
  }, [initialFilters]);

  const handleSubmit = () => {
    const filtersToSubmit = { ...filters };
    Object.keys(filtersToSubmit).forEach((key) => {
      if (!filtersToSubmit[key as keyof typeof filtersToSubmit]) {
        delete filtersToSubmit[key as keyof typeof filtersToSubmit];
      }
    });
    onSubmit(filtersToSubmit);
    onClose();
  };

  const handleReset = () => {
    setFilters({ ...defaultCompanyFilterState });
    onReset?.();
  };

  return (
    <Popover size={Popover.Size.MEDIUM}>
      <PopoverHeader onClose={onClose}>Apply Filters</PopoverHeader>
      <PopoverContent>
        <Grid className="gap-y-5">
          <Grid.Cell size={Grid.CellSize.S6} className="w-full">
            <TextFilter
              className="w-full"
              label="Company ID"
              placeholder="Enter Company ID"
              value={filters.companyId}
              onChange={(value) => setFilters({ ...filters, companyId: value })}
            />
          </Grid.Cell>
          <Grid.Cell size={Grid.CellSize.S6} className="w-full">
            <TextFilter
              className="w-full"
              label="Company Name"
              placeholder="Enter Company Name"
              value={filters.name}
              onChange={(value) => setFilters({ ...filters, name: value })}
            />
          </Grid.Cell>
          <Grid.Cell size={Grid.CellSize.S6} className="w-full">
            <TextFilter
              className="w-full"
              label="Email"
              placeholder="Enter Email"
              value={filters.email}
              onChange={(value) => setFilters({ ...filters, email: value })}
            />
          </Grid.Cell>
          <Grid.Cell size={Grid.CellSize.S6} className="w-full">
            <TextFilter
              className="w-full"
              label="SAP Username"
              placeholder="Enter SAP Username"
              value={filters.username}
              onChange={(value) => setFilters({ ...filters, username: value })}
            />
          </Grid.Cell>
        </Grid>
        <PopoverFooter>
          <Button variant={ButtonVariant.Primary} onClick={handleSubmit}>
            Apply Filters
          </Button>
          <Button variant={ButtonVariant.Outline} onClick={handleReset}>
            Reset
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default CompanyFilter;
