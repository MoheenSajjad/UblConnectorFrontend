import { useNavigate } from "react-router-dom";
import { CardProps } from "@/types/dashboard";

export const DashboardCard: React.FC<CardProps> = ({
  title,
  value,
  url,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (url) {
      navigate(url);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="p-4 border-l-4 cursor-pointer border-t-[1px] rounded-lg shadow-lg text-center hover:-translate-y-1 transition-transform duration-150 border-l-blue-500"
    >
      <p className="font-medium mb-2">{title}</p>
      <p className="text-2xl font-bold animate-slide-in-from-bottom text-black">
        {value}
      </p>
    </div>
  );
};

interface CardSkeletonProps {
  count?: number;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ count = 3 }) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="p-4 border-l-4 border-t-[1px] rounded-lg shadow-lg text-center border-l-gray-300 animate-pulse"
          >
            <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        ))}
    </>
  );
};

// Components/CardGrid.tsx - Reusable grid layout for cards
import React, { ReactNode } from "react";

interface CardGridProps {
  title: string;
  children: ReactNode;
  columns?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({
  title,
  children,
  columns = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
}) => {
  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold mb-2 ml-1">{title}</h2>
      <div className={`grid ${columns} gap-5`}>{children}</div>
    </section>
  );
};
