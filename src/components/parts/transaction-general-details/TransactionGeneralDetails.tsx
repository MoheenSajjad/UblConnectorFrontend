import React, { ReactNode } from "react";

interface TransactionGeneralDetailsProps {
  children: ReactNode;
}

const TransactionGeneralDetails: React.FC<TransactionGeneralDetailsProps> = ({
  children,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-start">
        <div className="min-w-max w-[35%] pl-2">{children}</div>
      </div>
    </div>
  );
};

export default TransactionGeneralDetails;
