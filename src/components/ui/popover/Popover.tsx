import { CloseIcon } from "@/components/icons/close-icon";

import React, { useState } from "react";
import { createPortal } from "react-dom";

enum PopoverSize {
  SMALL = "sm",
  MEDIUM = "md",
  LARGE = "lg",
  XLARGE = "xl",
}

interface PopoverProps {
  onClose?: () => void;
  Icon?: React.ReactNode;
  children: React.ReactNode;
  size?: PopoverSize;
}

type Popover = {
  (props: PopoverProps): JSX.Element;
  Size: typeof PopoverSize;
};

interface PopoverHeaderProps {
  children?: React.ReactNode;
  onClose: () => void;
}

interface PopoverContentProps {
  children: React.ReactNode;
}

interface PopoverFooterProps {
  children: React.ReactNode;
}

// PopoverHeader component
export const PopoverHeader = ({ onClose, children }: PopoverHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-4  rounded-t-md bg-lighter-grey">
      <h3 className="text-base font-semibold text-black" id="modal-title">
        {children && children}
      </h3>
      <div>
        <CloseIcon
          className="cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

// PopoverContent component
export const PopoverContent = ({ children }: PopoverContentProps) => {
  return (
    <div className={`mt-2 px-1 pb-4 pt-3 text-sm text-gray-500`}>
      {children}
    </div>
  );
};

// PopoverFooter component
export const PopoverFooter = ({ children }: PopoverFooterProps) => {
  return (
    <div className="px-4 pt-2  sm:flex sm:flex-row-reverse gap-2 sm:px-6 ">
      {children}
    </div>
  );
};

// Main Popover component
export const Popover = ({
  onClose,
  Icon,
  children,
  size = PopoverSize.MEDIUM,
}: PopoverProps) => {
  const sizeClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-4xl",
    lg: "sm:max-w-screen-lg ",
    xl: "sm:max-w-screen-xl",
  };

  return createPortal(
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500/75 transition-opacity duration-1000  ease-in-out"
        aria-hidden="true"
      ></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            className={` transform rounded-lg bg-white text-left shadow-xl transition-all  ${sizeClasses[size]}`}
          >
            {/* removed overflow hidden class on this */}
            <div className="bg-white rounded-md ">
              {/* <div className="sm:flex sm:items-start"> */}
              <div className="">
                {Icon && Icon}

                <div className="mt-1  text-center sm:mt-0 sm:text-left">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

Popover.Size = PopoverSize;
