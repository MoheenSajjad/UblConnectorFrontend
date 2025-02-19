import * as React from "react";
import { Input } from "../input/Input";
import { TextInputControl } from "../text-input-control";

enum TextInputControlType {
  TEXT = "text",
  PASSWORD = "password",
  DATE = "date",
  TIME = "time",
  TEXTAREA = "text-area",
  NUMBER = "number",
  DATETIME = "datetime-local",
}

type TextInputProps = {
  label?: string;
  icon?: React.ReactNode;
  value?: string | number | null;
  placeholder?: string;
  feedback?: string;
  tabIndex?: number;
  className?: string;
  isRequired?: boolean;
  hasInitialFocus?: boolean;
  hasError?: boolean;
  isDisabled?: boolean;
  onChange?: (value: string) => void;
  inputType?: TextInputControlType;
};

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      icon,
      value,
      placeholder,
      feedback,
      tabIndex,
      className,
      isRequired,
      hasInitialFocus = false,
      hasError,
      isDisabled,
      onChange,
      inputType = TextInputControlType.TEXT,
    },
    ref
  ) => {
    const [hasFocus, setHasFocus] = React.useState<boolean>(hasInitialFocus);

    return (
      <Input
        className={className}
        isRequired={isRequired}
        hasFocus={hasFocus}
        hasError={hasError}
        isDisabled={isDisabled}
      >
        {label && <Input.Label value={label} isRequired={isRequired} />}
        <Input.Border hasError={hasError}>
          {typeof icon !== "undefined" && <Input.Icon>{icon}</Input.Icon>}
          <Input.Control
            className={`${!icon && "px-2"} ${
              isDisabled && "bg-[#f3f0f0] rounded-lg"
            }`}
          >
            <TextInputControl
              type={inputType}
              value={value !== null ? value : ""}
              placeholder={placeholder}
              tabIndex={tabIndex}
              hasInitialFocus={hasInitialFocus}
              isDiabled={isDisabled}
              // ref={ref} // Attach ref here
              onChange={onChange}
              onFocus={setHasFocus}
            />
          </Input.Control>
        </Input.Border>
        {typeof feedback !== "undefined" && <Input.Feedback value={feedback} />}
      </Input>
    );
  }
);

// Add 'Type' property using Object.assign
Object.assign(TextInput, { Type: TextInputControlType });

export { TextInput };
