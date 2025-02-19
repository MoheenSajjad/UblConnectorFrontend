import * as React from "react";

// import cls from "./text-input-control.module.scss";

enum TextInputControlType {
  TEXT = "text",
  PASSWORD = "password",
  DATE = "date",
  TIME = "time",
  TEXTAREA = "text-area",
  NUMBER = "number",
  DATETIME = "datetime-local",
}

type TextInputControlProps = {
  type?: TextInputControlType;
  value?: string | number;
  placeholder?: string;
  tabIndex?: number;
  hasInitialFocus?: boolean;
  isDiabled?: boolean;
  onChange?: (value: string) => void;
  onFocus: (hasFocus: boolean) => void;
  hasError?: boolean;
};

type TextInputControlComponent = {
  (props: TextInputControlProps): JSX.Element;
  Type: typeof TextInputControlType;
};

export const TextInputControl: TextInputControlComponent = ({
  type = TextInputControlType.TEXT,
  value,
  placeholder,
  tabIndex,
  hasInitialFocus,
  isDiabled = false,
  hasError = false,
  onChange,
  onFocus,
}: TextInputControlProps): JSX.Element => {
  type InputType = HTMLInputElement | HTMLTextAreaElement;
  const handleValueChange = (event: React.ChangeEvent<InputType>) => {
    if (isDiabled) {
      return;
    }
    if (typeof onChange === "undefined") {
      return;
    }

    onChange(event.target.value);
  };

  const handleFocus = () => {
    onFocus(true);
  };

  const handleBlur = () => {
    onFocus(false);
  };

  if (type === TextInputControlType.TEXTAREA) {
    return (
      <textarea
        className={`h-full w-full border-none outline-none text-medium-grey bg-none font-medium placeholder:text-[#4C7FA5] p-4 resize-none ${
          hasError && "placeholder:text-DANGER"
        }`}
        value={value}
        placeholder={placeholder}
        autoFocus={hasInitialFocus}
        disabled={isDiabled}
        tabIndex={tabIndex}
        onChange={handleValueChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
  }

  return (
    <input
      //   className={cls["text-input"]}
      className={`h-full w-full border-none  outline-none text-gray-800 bg-none font-medium rounded-lg ${
        hasError && "placeholder:text-danger"
      } placeholder:font-medium`}
      type={type}
      value={value}
      placeholder={placeholder}
      autoFocus={hasInitialFocus}
      disabled={isDiabled}
      tabIndex={tabIndex}
      onChange={handleValueChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

TextInputControl.Type = TextInputControlType;
