import React from "react";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
import { Tag, TagTypeStyles } from "@/components/ui/Tag";

export const DetailItem = ({
  label,
  value,
  isStatus,
  isLink,
  tooltip,
  underline,
}: {
  label: string;
  value?: string;
  isStatus?: boolean;
  isLink?: boolean;
  tooltip?: string;
  underline?: boolean;
}) => {
  if (isLink) {
    return (
      <div className="cursor-pointer w-max text-primary font-poppins tracking-wider hover:underline">
        {label}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-secondary font-bold mr-2 whitespace-nowrap">
        {label}:
      </span>
      <div>
        {isStatus ? (
          <Tag type={getStatusTagType(value!)} label={value!} />
        ) : tooltip ? (
          <Tooltip content={tooltip} position={Tooltip.Position.Right}>
            <span
              className={`text-gray-700 ${
                underline
                  ? "border-b border-dashed border-gray-600 cursor-default"
                  : ""
              }`}
            >
              {value}
            </span>
          </Tooltip>
        ) : (
          <span
            className={`text-gray-700 ${
              underline
                ? "border-b border-dashed border-gray-600 cursor-default"
                : ""
            }`}
          >
            {value}
          </span>
        )}
      </div>
    </div>
  );
};

export const getStatusTagType = (status: string): TagTypeStyles => {
  switch (status) {
    case "Received":
      return TagTypeStyles.ON_TRACK;
    case "Failed":
      return TagTypeStyles.ERROR;
    case "Posted":
      return TagTypeStyles.ACTIVE;
    case "Synced":
      return TagTypeStyles.INFO;
    default:
      return TagTypeStyles.INACTIVE;
  }
};
