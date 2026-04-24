"use client";

import React, { memo, useMemo, useState } from "react";
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
import type { HealthIndicator } from "@/app/lib/health-indicator-config";
import { getHealthChartData, type HealthMockData } from "@/app/lib/health-mock-data";

interface HealthChartProps {
  indicator: HealthIndicator;
  data: HealthMockData;
}

type GenderView = "both" | "female" | "male";

const PIE_COLORS = ["#0f766e", "#d1d5db"];

function formatValue(value: number | string, unit: HealthIndicator["unit"]) {
  if (typeof value !== "number") return value;

  if (unit === "%") return `${value}%`;
  if (unit === "years") return `${value} years`;
  if (unit === "rate") return `${value} per 100,000`;
  if (unit === "count") return `${value}`;

  return `${value}`;
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

function HealthChartComponent({ indicator, data }: HealthChartProps) {
  const [genderView, setGenderView] = useState<GenderView>("both");

  const chartData = useMemo(() => getHealthChartData(indicator, data), [indicator, data]);

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
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-gray-500">Comparison by zone</p>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setGenderView("both")}
              className={`rounded-full px-3 py-1 ${
                genderView === "both" ? "bg-teal-700 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              Both
            </button>
            <button
              onClick={() => setGenderView("female")}
              className={`rounded-full px-3 py-1 ${
                genderView === "female" ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              Female
            </button>
            <button
              onClick={() => setGenderView("male")}
              className={`rounded-full px-3 py-1 ${
                genderView === "male" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              Male
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={460}>
          <BarChart data={rows} margin={{ top: 12, right: 12, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={tooltipFormatter} />
            <Legend />

            {(genderView === "both" || genderView === "female") && (
              <Bar dataKey="female" name="Female" fill="#db2777" radius={[6, 6, 0, 0]} />
            )}
            {(genderView === "both" || genderView === "male") && (
              <Bar dataKey="male" name="Male" fill="#2563eb" radius={[6, 6, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderBar = () => {
    const rows = Array.isArray(chartData) ? chartData : [];
    const isSensitive = indicator.sensitive;

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <ResponsiveContainer width="100%" height={460}>
          <BarChart data={rows} margin={{ top: 12, right: 12, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={tooltipFormatter} />
            <Bar
              dataKey="value"
              fill={isSensitive ? "#6b7280" : "#0f766e"}
              radius={[6, 6, 0, 0]}
              name={indicator.label}
            />
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
            <Pie
              data={rows}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label={({ name, value }) => `${name}: ${formatValue(value as number, "%")}`}
            >
              {rows.map((item, idx) => (
                <Cell key={`${item.name}-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
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
    const value = typeof chartData === "number" ? chartData : 0;

    return (
      <div className="grid h-[460px] place-items-center rounded-xl border border-gray-200 bg-white p-4">
        <div
          className={`w-full max-w-xl rounded-2xl p-8 text-center ${
            indicator.sensitive ? "bg-gray-50 border border-gray-200" : "bg-teal-50 border border-teal-200"
          }`}
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">Headline Metric</p>
          <p className="mt-4 text-6xl font-bold text-gray-900">{formatValue(value, indicator.unit)}</p>
          <p className="mt-3 text-sm text-gray-600">{indicator.label}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200" style={{ animation: "chartFade 220ms ease" }}>
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

export const HealthChart = memo(HealthChartComponent);
