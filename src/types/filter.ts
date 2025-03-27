export interface BaseFilterProps {
  className?: string;
}

export interface TextFilterProps extends BaseFilterProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownFilterProps extends BaseFilterProps {
  label: string;
  isDisabled?: boolean;
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
}

export interface DateRangeFilterProps extends BaseFilterProps {
  label: string;
  startName: string;
  endName: string;
  startValue: string;
  endValue: string;
  onChange: (startDate: string, endDate: string) => void;
}

export interface CheckboxFilterProps extends BaseFilterProps {
  label: string;
  name: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupFilterProps extends BaseFilterProps {
  label: string;
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
}

export interface FilterContainerProps extends BaseFilterProps {
  title?: string;
  description?: string;
  onSubmit: (filters: Record<string, any>) => void;
  onReset?: () => void;
  defaultValues?: Record<string, any>;
  children: React.ReactNode;
}
