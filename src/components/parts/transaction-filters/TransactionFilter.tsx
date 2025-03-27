import React, { useEffect, useState } from "react";
import {
  TextFilter,
  DateRangeFilter,
  DropdownFilter,
} from "@/components/ui/filter-fields";
import { Grid } from "@/components/ui/grid";
import {
  Popover,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
} from "@/components/ui/popover";
import { Button, ButtonVariant } from "@/components/ui/Button";
import { transactiontype, transactionStatus } from "@/types/transaction";

interface TransactionFilterProps {
  onSubmit: (filters: TransactionFilterState) => void;
  onReset?: () => void;
  onClose: () => void;
  initialFilters?: Partial<TransactionFilterState>;
}

export interface TransactionFilterState {
  companyName: string;
  createdAt: {
    start: string | null;
    end: string | null;
  };
  payloadType: string;
  transactionType: transactiontype;
  status: transactionStatus;
  businessPartnerName: string;
}

const payloadTypeOptions = [
  { label: "All", value: "" },
  { label: "XML", value: "Xml" },
  { label: "JSON", value: "Json" },
];

const statusOptions = [
  { label: "Received", value: "Received" },
  { label: "Draft", value: "Draft" },
  { label: "Posted", value: "Posted" },
  { label: "Synced", value: "Synced" },
  { label: "Failed", value: "Failed" },
];

export const defaultFilterState: TransactionFilterState = {
  companyName: "",
  createdAt: {
    start: null,
    end: null,
  },
  payloadType: "",
  transactionType: "peppol",
  status: "Received",
  businessPartnerName: "",
};

export const TransactionFilter: React.FC<TransactionFilterProps> = ({
  onSubmit,
  onReset,
  onClose,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<TransactionFilterState>({
    ...defaultFilterState,
    ...initialFilters,
    createdAt: {
      ...defaultFilterState.createdAt,
      ...(initialFilters?.createdAt || {}),
    },
  });

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...defaultFilterState,
      ...initialFilters,
      createdAt: {
        ...defaultFilterState.createdAt,
        ...(initialFilters?.createdAt || {}),
      },
    }));
  }, [initialFilters]);

  const handleSubmit = () => {
    const filtersToSubmit = { ...filters };

    Object.keys(filtersToSubmit).forEach((key) => {
      if (
        key !== "createdAt" &&
        !filtersToSubmit[key as keyof typeof filtersToSubmit]
      ) {
        delete filtersToSubmit[key as keyof typeof filtersToSubmit];
      }
    });

    if (filtersToSubmit.createdAt) {
      filtersToSubmit.createdAt = {
        start: filtersToSubmit.createdAt.start || null,
        end: filtersToSubmit.createdAt.end || null,
      };
    }

    onSubmit(filtersToSubmit);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      ...defaultFilterState,
      status: initialFilters?.status || "Received",
    });
  };

  return (
    <Popover size={Popover.Size.MEDIUM}>
      <PopoverHeader onClose={onClose}>Apply Filters</PopoverHeader>
      <PopoverContent>
        <Grid className="gap-y-5">
          <Grid.Cell size={Grid.CellSize.S6} className="w-full">
            <TextFilter
              className="w-full"
              label="Company Name"
              placeholder={"Enter Company Name"}
              value={filters.companyName}
              onChange={(value) =>
                setFilters({ ...filters, companyName: value })
              }
            />
          </Grid.Cell>

          <Grid.Cell size={Grid.CellSize.S6} className="w-full">
            <DateRangeFilter
              label="Created At"
              startName="start"
              endName="end"
              startValue={filters.createdAt.start ?? ""}
              endValue={filters.createdAt.end ?? ""}
              onChange={(start, end) =>
                setFilters({
                  ...filters,
                  createdAt: {
                    start,
                    end,
                  },
                })
              }
            />
          </Grid.Cell>

          <Grid.Cell size={Grid.CellSize.S3} className="w-full">
            <DropdownFilter
              label="Payload Type"
              className="w-full"
              options={payloadTypeOptions}
              value={filters.payloadType}
              onChange={(value) =>
                setFilters({ ...filters, payloadType: value })
              }
            />
          </Grid.Cell>

          {/* <Grid.Cell size={Grid.CellSize.S3} className="w-full">
            <DropdownFilter
              label="Status"
              className="w-full"
              isDisabled
              options={statusOptions}
              value={filters.status}
              onChange={(value) =>
                setFilters({ ...filters, status: value as transactionStatus })
              }
            />
          </Grid.Cell> */}

          <Grid.Cell size={Grid.CellSize.S3} className="w-full">
            <TextFilter
              className="w-full"
              label="Business Partner"
              placeholder={"Enter Business Partner Name"}
              value={filters.businessPartnerName}
              onChange={(value) =>
                setFilters({ ...filters, businessPartnerName: value })
              }
            />
          </Grid.Cell>
        </Grid>
        <PopoverFooter>
          <Button variant={ButtonVariant.Primary} onClick={handleSubmit}>
            Apply Filters
          </Button>
          <Button
            isSubmit
            variant={ButtonVariant.Outline}
            onClick={handleReset}
          >
            Reset
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default TransactionFilter;
