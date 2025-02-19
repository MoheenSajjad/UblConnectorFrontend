import React, { ReactNode } from "react";

interface DetailWrapperProps {
  children: ReactNode;
}

export const DetailWrapper: React.FC<DetailWrapperProps> = ({ children }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-start">
        <div className="min-w-max w-[35%] pl-2">{children}</div>
      </div>
    </div>
  );
};
