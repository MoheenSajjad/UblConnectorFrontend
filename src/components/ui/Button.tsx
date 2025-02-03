import React from "react";

import { Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ButtonSize = {
  Small: "small",
  Medium: "medium",
  Large: "large",
} as const;

const ButtonVariant = {
  Primary: "primary",
  Secondary: "secondary",
  Outline: "outline",
  Ghost: "ghost",
  Destructive: "destructive",
} as const;

type ButtonSizeType = (typeof ButtonSize)[keyof typeof ButtonSize];
type ButtonVariantType = (typeof ButtonVariant)[keyof typeof ButtonVariant];

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSizeType;
  variant?: ButtonVariantType;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      size = ButtonSize.Medium,
      variant = ButtonVariant.Primary,
      icon: Icon,
      iconPosition = "left",
      isLoading = false,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      [ButtonSize.Small]: "px-3 py-1.5 text-sm",
      [ButtonSize.Medium]: "px-5 py-1 text-sm",
      [ButtonSize.Large]: "px-6 py-3 text-base",
    };

    const variantClasses = {
      [ButtonVariant.Primary]:
        "bg-[#1362fb] text-white hover:bg-[#1362fb]/90 focus:ring-[#1362fb]/20",
      [ButtonVariant.Secondary]:
        "bg-[#233558] text-white hover:bg-[#233558]/90 focus:ring-[#233558]/20",
      [ButtonVariant.Outline]:
        "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500/20",
      [ButtonVariant.Ghost]:
        "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500/20",
      [ButtonVariant.Destructive]:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/20",
    };

    return (
      <button
        ref={ref}
        className={`relative inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none  disabled:pointer-events-none disabled:opacity-50
          ${sizeClasses[size]},
          ${variantClasses[variant]}
          ${fullWidth && "w-full"}
          ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-spin" />
        )}
        <span className={`flex items-center gap-2 ${isLoading && "invisible"}`}>
          {Icon && iconPosition === "left" && <Icon className="h-4 w-4" />}
          {children}
          {Icon && iconPosition === "right" && <Icon className="h-4 w-4" />}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, ButtonSize, ButtonVariant };
export type { ButtonProps, ButtonSizeType, ButtonVariantType };
