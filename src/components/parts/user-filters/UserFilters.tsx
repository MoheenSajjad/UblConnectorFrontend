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

interface UserFilterProps {
  onSubmit: (filters: UserFilterState) => void;
  onReset?: () => void;
  onClose: () => void;
  initialFilters?: Partial<UserFilterState>;
}

export interface UserFilterState {
  name: string;
  email: string;
}

export const defaultUserFilterState: UserFilterState = {
  name: "",
  email: "",
};

export const UserFilter: React.FC<UserFilterProps> = ({
  onSubmit,
  onReset,
  onClose,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<UserFilterState>({
    ...defaultUserFilterState,
    ...initialFilters,
  });

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...defaultUserFilterState,
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
    setFilters({ ...defaultUserFilterState });
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
              label="User Name"
              placeholder="Enter User Name"
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

export default UserFilter;
