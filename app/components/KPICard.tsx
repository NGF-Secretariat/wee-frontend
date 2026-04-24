"use client";

import React from "react";

interface KPICardProps {
  label: string;
  value: number | string;
  unit?: string;
  description?: string;
  trend?: {
    direction: "up" | "down";
    percentage: number;
  };
  color?: string;
  icon?: React.ReactNode;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  unit = "",
  description,
  trend,
  color = "bg-gradient-to-br from-blue-50 to-blue-100",
  icon,
}) => {
  const trendColor = trend?.direction === "up" ? "text-green-600" : "text-red-600";
  const trendIcon = trend?.direction === "up" ? "↑" : "↓";

  return (
    <div
      className={`${color} rounded-xl shadow-md p-6 w-full max-w-sm hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600">{label}</h3>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-800">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-lg text-gray-600">{unit}</span>}
      </div>

      {trend && (
        <div className={`mt-4 flex items-center gap-2 ${trendColor}`}>
          <span className="text-lg">{trendIcon}</span>
          <span className="text-sm font-medium">
            {trend.percentage}% {trend.direction === "up" ? "increase" : "decrease"}
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * KPI Grid Component for displaying multiple KPIs
 */
interface KPIGridProps {
  cards: KPICardProps[];
  columns?: 1 | 2 | 3 | 4;
}

export const KPIGrid: React.FC<KPIGridProps> = ({ cards, columns = 2 }) => {
  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <div className={`grid ${gridClass[columns]} gap-4 w-full`}>
      {cards.map((card, idx) => (
        <KPICard key={idx} {...card} />
      ))}
    </div>
  );
};
