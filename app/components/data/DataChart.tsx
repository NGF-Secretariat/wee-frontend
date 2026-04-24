"use client";

import React, { memo, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import type { DataPageIndicator } from "@/app/lib/data-page-indicator-config";
import { getDataPageChartData, type DataPageMockData } from "@/app/lib/data-page-mock-data";

interface DataChartProps {
  indicator: DataPageIndicator;
  data: DataPageMockData;
}

const BAR_COLORS = ["#0f766e", "#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4"];

const formatTooltipValue = (
  value: number | string | readonly (number | string)[] | undefined
) => {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  if (value === undefined) {
    return "N/A";
  }
  return value;
};

function DataChartComponent({ indicator, data }: DataChartProps) {
  const chartData = useMemo(() => getDataPageChartData(indicator, data), [indicator, data]);

  const renderGroupedBar = () => {
    const rows = Array.isArray(chartData) ? chartData : [];

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <ResponsiveContainer width="100%" height={460}>
          <BarChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
            <Tooltip formatter={(value) => `${formatTooltipValue(value)}%`} />
            <Legend />
            <Bar dataKey="female" name="Female" fill="#db2777" radius={[6, 6, 0, 0]} />
            <Bar dataKey="male" name="Male" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderBar = () => {
    const rows = Array.isArray(chartData) ? chartData : [];

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <ResponsiveContainer width="100%" height={460}>
          <BarChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
            <Tooltip formatter={(value) => `${formatTooltipValue(value)} / 100`} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {rows.map((item, idx) => (
                <Cell key={`${item.name}-${idx}`} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderKPI = () => {
    const adopted = Boolean(chartData);

    return (
      <div className="grid h-[460px] place-items-center rounded-xl border border-gray-200 bg-white p-4">
        <div
          className={`w-full max-w-xl rounded-2xl border p-8 text-center ${
            adopted ? "border-emerald-200 bg-emerald-50" : "border-gray-300 bg-gray-50"
          }`}
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">Policy Status</p>
          <p className="mt-4 text-5xl font-bold text-gray-900">{adopted ? "Adopted" : "Not Adopted"}</p>
          <p className="mt-3 text-sm text-gray-600">{indicator.label}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm" style={{ animation: "chartFade 220ms ease" }}>
      <h2 className="text-xl font-semibold text-gray-900">{indicator.label}</h2>
      <p className="mt-1 text-sm text-gray-600">{indicator.description}</p>
      <div className="mt-4">
        {indicator.preferredChart === "groupedBar" && renderGroupedBar()}
        {indicator.preferredChart === "bar" && renderBar()}
        {indicator.preferredChart === "kpi" && renderKPI()}
      </div>

      <style jsx>{`
        @keyframes chartFade {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export const DataChart = memo(DataChartComponent);
