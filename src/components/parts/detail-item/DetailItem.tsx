import React, { ReactNode } from "react";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
import { Tag, TagTypeStyles } from "@/components/ui/Tag";

export const DetailItem = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-secondary font-bold mr-2 whitespace-nowrap">
        {label}:
      </span>
      {children}
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
