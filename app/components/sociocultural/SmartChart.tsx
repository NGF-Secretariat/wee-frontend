"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  SocioculturalIndicator,
  CATEGORY_LABELS,
} from "@/app/lib/sociocultural-indicator-config";
import {
  STATE_GENDER_DATA,
  INFRASTRUCTURE_DATA,
  GENDER_COMPARISON_DATA,
  getSortedStates,
} from "@/app/lib/sociocultural-mock-data";

interface SmartChartProps {
  indicator: SocioculturalIndicator | undefined;
  showStates?: boolean;
}

const COLORS = [
  "#06923E",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
];

const GENDER_COLORS = {
  female: "#FF6B6B",
  male: "#4ECDC4",
};

interface ChartDataPoint {
  [key: string]: any;
}

export const SocioculturalSmartChart: React.FC<SmartChartProps> = ({
  indicator,
  showStates = true,
}) => {
  const chartData = useMemo(() => {
    if (!indicator) return [];

    const states = getSortedStates();

    // Gender comparison chart (bar chart side by side)
    if (indicator.isMaleFemalePair && showStates) {
      return states.map((state) => {
        const stateData = STATE_GENDER_DATA.find((s) => s.state === state);
        if (!stateData) return { name: state };

        const femaleKey = indicator.dataKey;
        const maleKey = indicator.relatedPairId || indicator.dataKey.replace("_female", "_male");

        return {
          name: state,
          female: (stateData as any)[femaleKey] || 0,
          male: (stateData as any)[maleKey] || 0,
        };
      });
    }

    // Infrastructure data (facilities, distances, hours)
    if (indicator.category === "infrastructure" && showStates) {
      return states.map((state) => {
        const infraData = INFRASTRUCTURE_DATA.find((s) => s.state === state);
        if (!infraData) return { name: state };

        return {
          name: state,
          value: (infraData as any)[indicator.dataKey] || 0,
        };
      });
    }

    // Single gender indicator
    if (!indicator.isMaleFemalePair && indicator.type !== "general") {
      return states.map((state) => {
        const stateData = STATE_GENDER_DATA.find((s) => s.state === state);
        if (!stateData) return { name: state };

        return {
          name: state,
          value: (stateData as any)[indicator.dataKey] || 0,
        };
      });
    }

    return [];
  }, [indicator, showStates]);

  // Render grouped bar chart (male vs female comparison)
  const renderGroupedBar = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          label={{ value: indicator?.unit || "", angle: -90, position: "insideLeft" }}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          formatter={(value: any) =>
            typeof value === "number"
              ? value.toFixed(
                  indicator?.unit === "hours" ? 1 : 0
                )
              : value
          }
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #06923E",
            borderRadius: "4px",
            padding: "8px",
          }}
        />
        <Legend wrapperStyle={{ paddingTop: "20px" }} />
        <Bar
          dataKey="female"
          fill={GENDER_COLORS.female}
          name="Female"
          radius={[8, 8, 0, 0]}
        />
        <Bar
          dataKey="male"
          fill={GENDER_COLORS.male}
          name="Male"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  // Render single bar chart
  const renderBar = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          label={{ value: indicator?.unit || "", angle: -90, position: "insideLeft" }}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          formatter={(value: any) =>
            typeof value === "number"
              ? value.toFixed(
                  indicator?.unit === "hours" ? 1 : 0
                )
              : value
          }
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #06923E",
            borderRadius: "4px",
            padding: "8px",
          }}
        />
        <Bar
          dataKey="value"
          fill="#06923E"
          radius={[8, 8, 0, 0]}
          name={indicator?.label}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  // Render pie chart (female vs male distribution)
  const renderPie = () => {
    const firstDataPoint = chartData[0] as any;
    const pieData = [
      {
        name: "Female",
        value: firstDataPoint?.female || 0,
      },
      {
        name: "Male",
        value: firstDataPoint?.male || 0,
      },
    ];

    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value, percent = 0 }) =>
              `${name}: ${value.toFixed(0)} (${(percent * 100).toFixed(1)}%)`
            }
            outerRadius={120}
            fill="#06923E"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={Object.values(GENDER_COLORS)[index]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) =>
              typeof value === "number" ? value.toFixed(0) : value
            }
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // Render KPI (single value display)
  const renderKPI = () => {
    const firstDataPoint = chartData[0] as any;
    const value = firstDataPoint?.value;
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <div className="text-6xl font-bold text-[#06923E] mb-4">
            {typeof value === "number"
              ? value.toFixed(indicator?.unit === "hours" ? 1 : 0)
              : value}
          </div>
          <div className="text-2xl text-gray-600">{indicator?.unit}</div>
          <div className="text-lg text-gray-500 mt-4">{indicator?.label}</div>
        </div>
      </div>
    );
  };

  if (!indicator) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg">Select an indicator to view data</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {indicator.label}
        </h3>
        <p className="text-sm text-gray-600">{indicator.description}</p>
        <div className="mt-2 flex gap-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            {CATEGORY_LABELS[indicator.category]}
          </span>
          {indicator.unit && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              Unit: {indicator.unit}
            </span>
          )}
        </div>
      </div>

      {/* Render appropriate chart based on preferredChart type */}
      {indicator.preferredChart === "groupedBar" && renderGroupedBar()}
      {indicator.preferredChart === "bar" && renderBar()}
      {indicator.preferredChart === "pie" && renderPie()}
      {indicator.preferredChart === "kpi" && renderKPI()}
    </div>
  );
};
