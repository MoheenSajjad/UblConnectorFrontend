import React from "react";

export interface INoDataBoundaryProps {
  condition?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const NoDataBoundary: React.FC<INoDataBoundaryProps> = ({
  condition = true,
  children,
  fallback,
}) => {
  return condition ? <>{children}</> : <>{fallback}</>;
};
