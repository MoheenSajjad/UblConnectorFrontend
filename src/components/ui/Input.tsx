import React from "react";
import { cn } from "@/lib/utils";
import { DivideIcon as LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefixIcon?: typeof LucideIcon;
  suffixIcon?: typeof LucideIcon;
  hasError?: boolean;
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      prefixIcon: PrefixIcon,
      suffixIcon: SuffixIcon,
      hasError,
      errorMessage,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {PrefixIcon && (
            <PrefixIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors",
              "focus:border-[#1362fb] focus:ring-1 focus:ring-[#1362fb]",
              "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
              PrefixIcon && "pl-10",
              SuffixIcon && "pr-10",
              hasError &&
                "border-red-500 focus:border-red-500 focus:ring-red-500",
              className
            )}
            {...props}
          />
          {SuffixIcon && (
            <SuffixIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}
        </div>
        {hasError && errorMessage && (
          <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
