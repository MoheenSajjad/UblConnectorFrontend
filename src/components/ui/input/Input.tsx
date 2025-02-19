import * as React from "react";

enum InputSize {
  DEFAULT = "default",
  LARGE = "large",
}

export type InputProps = {
  size?: InputSize;
  children?: React.ReactNode;
  className?: string;
  isRequired?: boolean;
  hasFocus?: boolean;
  hasError?: boolean;
  isDisabled?: boolean;
};

type InputComponent = {
  (props: InputProps): JSX.Element;
  Size: typeof InputSize;
  Label: typeof InputLabel;
  Border: typeof InputBorder;
  Icon: typeof InputIcon;
  Control: typeof InputControl;
  Handler: typeof InputHandler;
  Feedback: typeof InputFeedback;
};

export const Input: InputComponent = ({
  size = InputSize.DEFAULT,
  children,
  className,
  isRequired = false,
  hasFocus = false,
  hasError = false,
  isDisabled = false,
}: InputProps): JSX.Element => {
  const inputClasses = `
    inline-block ${isDisabled ? "cursor-default" : ""} 
    ${isRequired ? "input--is-required" : ""}
    ${hasFocus ? "input--has-focus" : ""}
    ${hasError ? "input--has-error" : ""}
    ${isDisabled ? "input--is-disabled" : ""} 
    ${className ?? ""}
  `;

  return <div className={`${inputClasses} relative`}>{children}</div>;
};

type InputLabelProps = {
  value: string;
  hasError?: boolean;
  isRequired?: boolean;
};

const InputLabel = ({
  value,
  hasError,
  isRequired = false,
}: InputLabelProps): JSX.Element => {
  return (
    <label
      className={`block text-sm font-medium transition-colors duration-150 mb-1 text-gray-700 ${
        hasError ? "text-red-600" : ""
      } ${
        isRequired &&
        "relative after:content-['*'] after:text-red-500 after:ml-1"
      }`}
    >
      {value}
    </label>
  );
};

type InputBorderProps = {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  hasError?: boolean;
};

const InputBorder = ({
  className,
  onClick,
  children,
  hasError = false,
}: InputBorderProps): JSX.Element => {
  return (
    <div
      className={`flex w-full border  rounded-lg  bg-white h-9 mb-5 ${className} ${
        hasError ? " border-danger" : "border-gray-300"
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

type InputIconProps = {
  children: React.ReactNode;
};

const InputIcon = ({ children }: InputIconProps): JSX.Element => {
  return (
    <div className="flex items-center justify-center w-10 h-full text-xl text-slate-600">
      {children}
    </div>
  );
};

type InputControlProps = {
  children: React.ReactNode;
  className?: string;
};

const InputControl = ({
  children,
  className,
}: InputControlProps): JSX.Element => {
  return (
    <div className={`flex items-center flex-1 h-full pr-2 ${className}`}>
      {children}
    </div>
  );
};

type InputHandlerProps = {
  children: React.ReactNode;
};

const InputHandler = ({ children }: InputHandlerProps): JSX.Element => {
  return (
    <div className="flex items-center justify-center w-8 h-full">
      {children}
    </div>
  );
};

type InputFeedbackProps = {
  value: string;
};

const InputFeedback = ({ value }: InputFeedbackProps): JSX.Element => {
  return (
    <div className="text-sm text-green-600 dark:text-green-500 text-red-600 dark:text-red-500 absolute bottom-0">
      {/* {value} */}
    </div>
  );
};

Input.Size = InputSize;
Input.Label = InputLabel;
Input.Border = InputBorder;
Input.Icon = InputIcon;
Input.Control = InputControl;
Input.Handler = InputHandler;
Input.Feedback = InputFeedback;
