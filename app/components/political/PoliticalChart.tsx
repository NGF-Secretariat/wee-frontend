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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { GovernanceIndicator } from "@/app/lib/governance-indicator-config";
import { getGovernanceChartData, type GovernanceMockData } from "@/app/lib/governance-mock-data";

interface PoliticalChartProps {
  indicator: GovernanceIndicator;
  data: GovernanceMockData;
}

const PIE_COLORS = ["#0f766e", "#14b8a6", "#a7f3d0", "#d1fae5"];

function formatValue(value: number | string, unit: GovernanceIndicator["unit"]) {
  if (typeof value !== "number") return value;
  if (unit === "%") return `${value}%`;
  if (unit === "count") return value.toLocaleString();
  if (unit === "boolean") return value === 1 ? "Yes" : "No";
  return value;
}

function normalizeTooltipValue(
  value: number | string | readonly (number | string)[] | undefined
): number | string {
  if (typeof value === "number" || typeof value === "string") {
    return value;
  }
  if (value === undefined) {
    return "N/A";
  }
  return value.join(", ");
}

function PoliticalChartComponent({ indicator, data }: PoliticalChartProps) {
  const chartData = useMemo(() => getGovernanceChartData(indicator, data), [indicator, data]);

  const tooltipFormatter = (value: number | string | readonly (number | string)[] | undefined) => {
    const normalized = normalizeTooltipValue(value);
    if (typeof normalized === "number") {
      return formatValue(normalized, indicator.unit);
    }
    const maybeNumber = Number(normalized);
    return Number.isNaN(maybeNumber)
      ? normalized
      : formatValue(maybeNumber, indicator.unit);
  };

  const renderGroupedBar = () => {
    const rows = Array.isArray(chartData) ? chartData : [];

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <ResponsiveContainer width="100%" height={460}>
          <BarChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={tooltipFormatter} />
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
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={tooltipFormatter} />
            <Bar dataKey="value" fill="#0f766e" radius={[6, 6, 0, 0]} name={indicator.label} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderPie = () => {
    const rows = Array.isArray(chartData) ? chartData : [];

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <ResponsiveContainer width="100%" height={460}>
          <PieChart>
            <Pie data={rows} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} label>
              {rows.map((entry, idx) => (
                <Cell key={`${entry.name}-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={tooltipFormatter} />
            <Legend />
          </PieChart>
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
          <p className="mt-4 text-5xl font-bold text-gray-900">{adopted ? "In Place" : "Not in Place"}</p>
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
        {indicator.preferredChart === "pie" && renderPie()}
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

export const PoliticalChart = memo(PoliticalChartComponent);
