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

  const statusColors: Record<string, string> = {
    Received: "border-l-green-500  text-green-800",
    Posted: "border-l-blue-500  text-blue-800",
    Synced: "border-l-teal-500  text-teal-800",
    Draft: "border-l-yellow-500  text-yellow-800",
    Failed: "border-l-red-500 bg-red-100 text-red-800",
    Default: "border-l-blue-500  text-blue-800",
    All: "border-l-purple-500 text-purple-800",
  };

  const colorClass = statusColors[title] || statusColors["Default"];

  return (
    <SlideUp>
      <div
        onClick={handleClick}
        className={`p-2 border-l-4 cursor-pointer border-t-[1px] rounded-lg shadow-lg text-center hover:-translate-y-1 transition-transform duration-150 ${colorClass}`}
      >
        <p className="font-medium mb-2">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </SlideUp>
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
            className="p-3 border-l-4 border-t-[1px] rounded-lg shadow-lg text-center border-l-gray-300 animate-pulse"
          >
            <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-7 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        ))}
    </>
  );
};

import React, { ReactNode } from "react";
import { SlideUp } from "@/components/animations";
import { AnimationEase } from "@/types/animations";

interface CardGridProps {
  title: string;
  children: ReactNode;
  columns?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({
  title,
  children,
  columns = "grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
}) => {
  return (
    <section className="mt-2">
      <SlideUp>
        <h2 className="text-lg font-semibold mb-2 ml-1">{title}</h2>
      </SlideUp>
      <div className={`grid ${columns} gap-5`}>{children}</div>
    </section>
  );
};
