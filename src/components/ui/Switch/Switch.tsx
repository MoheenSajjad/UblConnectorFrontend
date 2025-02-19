import { Check } from "lucide-react";
import React, { useState } from "react";
import { CheckIcon } from "@/components/icons";
import { Input } from "../input/Input";

interface SwitchProps {
  size?: SwitchSize;
  checked?: boolean;
  onIcon?: React.ReactNode;
  offIcon?: React.ReactNode;
  label: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

enum SwitchSize {
  SMALL = "Small",
  MEDIUM = "Medium",
  LARGE = "Large",
  EXTRASMALL = "ExtraSmall",
}

type SwitchComponent = {
  (props: SwitchProps): JSX.Element;
  size: typeof SwitchSize;
};

export const Switch: SwitchComponent = ({
  size = SwitchSize.MEDIUM,
  onIcon,
  offIcon,
  label,
  defaultChecked,
  disabled,
  onChange,
  checked,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(defaultChecked || false);

  const handleToggle = () => {
    if (disabled) return;
    const newState = !isChecked;
    setIsChecked(newState);
    onChange?.(newState);
  };

  React.useEffect(() => {
    if (typeof checked === "boolean") {
      setIsChecked(checked);
    }
  }, [checked]);

  const sizes: Record<
    SwitchSize,
    { container: string; knob: string; toggledKnob: string }
  > = {
    [SwitchSize.LARGE]: {
      container: "w-[70px] h-[40px] p-[0.160rem]",
      knob: "w-[32px] h-[32px] translate-x-[2px]",
      toggledKnob: "translate-x-[30px]",
    },
    [SwitchSize.MEDIUM]: {
      container: "w-[65px] h-[36px] p-[0.180rem]",
      knob: "w-[28px] h-[28px] translate-x-[2px]",
      toggledKnob: "w-[28px] h-[28px] translate-x-[28px]",
    },
    [SwitchSize.SMALL]: {
      container: "w-[60px] h-[33px] p-[0.180rem]",
      knob: "w-[25px] h-[25px] translate-x-[2px]",
      toggledKnob: "w-[25px] h-[25px] translate-x-[26px]",
    },
    [SwitchSize.EXTRASMALL]: {
      container: "w-[57px] h-[30px] px-[0.150rem] py-[0.160rem]",
      knob: "w-[23px] h-[23px] translate-x-[1px]",
      toggledKnob: "translate-x-[27px]",
    },
  };

  const selectedSize = sizes[size];

  return (
    <div className="flex flex-col w-full mb-3">
      {label && <Input.Label value={label} />}

      <div
        className={`${isChecked ? "!bg-[#3B9DF8]" : "bg-[#f0f0f0]"} ${
          selectedSize.container
        } 
        border transition-colors cursor-pointer  duration-500 border-[#e5eaf2] rounded-full relative inline-block`}
        onClick={handleToggle}
      >
        <div
          className={`${
            isChecked
              ? selectedSize.toggledKnob + " !bg-white"
              : selectedSize.knob
          } transition-all duration-500 rounded-full bg-white shadow-md`}
        >
          {onIcon && isChecked && (
            <span className="absolute left-1 top-1/2 transform -translate-y-1/2">
              {onIcon}
            </span>
          )}
          {offIcon && !isChecked && (
            <span className="absolute left-[2px] top-1/2 transform -translate-y-1/2">
              {offIcon}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

Switch.size = SwitchSize;
