import * as React from "react";

import { Input } from "../input";
import { TextInputControl } from "../text-input-control";
import { IconButton } from "../IconButton";
import { EyeIcon, EyeOffIcon } from "@/components/icons";

type PasswordInputProps = {
  label: string;
  icon?: React.ReactNode;
  value?: string;
  placeholder?: string;
  feedback?: string;
  tabIndex?: number;
  className?: string;
  isRequired?: boolean;
  hasInitialFocus?: boolean;
  hasError?: boolean;
  isDisabled?: boolean;
  onChange?: (value: string) => void;
};

export const PasswordInput = ({
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
}: PasswordInputProps): JSX.Element => {
  const [hasFocus, setHasFocus] = React.useState<boolean>(hasInitialFocus);

  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible((passwordVisible) => !passwordVisible);
  };

  return (
    <Input
      className={className}
      isRequired={isRequired}
      hasFocus={hasFocus}
      hasError={hasError}
      isDisabled={isDisabled}
    >
      <Input.Label value={label} isRequired />
      <Input.Border hasError={hasError}>
        {typeof icon !== "undefined" && <Input.Icon>{icon}</Input.Icon>}
        <Input.Control
          className={`${!icon && "px-2"} ${
            isDisabled && "bg-[#f3f0f0] rounded-lg"
          }`}
        >
          <TextInputControl
            type={
              passwordVisible
                ? TextInputControl.Type.TEXT
                : TextInputControl.Type.PASSWORD
            }
            value={value}
            placeholder={placeholder}
            tabIndex={tabIndex}
            hasInitialFocus={hasInitialFocus}
            isDiabled={isDisabled}
            onChange={onChange}
            onFocus={setHasFocus}
          />
        </Input.Control>
        <IconButton
          icon={passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
          isDisabled={isDisabled}
          onClick={handleTogglePasswordVisibility}
        />
      </Input.Border>
      {typeof feedback !== "undefined" && <Input.Feedback value={feedback} />}
    </Input>
  );
};
