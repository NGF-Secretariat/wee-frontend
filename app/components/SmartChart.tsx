"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { IndicatorMetadata } from "@/app/lib/indicator-config";
import { KPICard } from "./KPICard";

const COLORS = ["#2563eb", "#dc2626", "#16a34a", "#f59e0b", "#8b5cf6", "#ec4899"];

interface SmartChartProps {
  indicator: IndicatorMetadata;
  data: any;
  title?: string;
  height?: number;
  onDrillDown?: (drill: string) => void;
  showLegend?: boolean;
}

/**
 * SmartChart Component
 * Intelligently renders the best visualization based on indicator type
 */
export const SmartChart: React.FC<SmartChartProps> = ({
  indicator,
  data,
  title,
  height = 400,
  onDrillDown,
  showLegend = true,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Determine what to render based on preferredChart
  switch (indicator.preferredChart) {
    case "map":
      return (
        <MapVisualization
          indicator={indicator}
          data={data}
          title={title}
          height={height}
          onDrillDown={onDrillDown}
        />
      );

    case "bar":
      return (
        <BarVisualization
          indicator={indicator}
          data={data}
          title={title}
          height={height}
        />
      );

    case "pie":
      return (
        <PieVisualization
          indicator={indicator}
          data={data}
          title={title}
          height={height}
        />
      );

    case "line":
      return (
        <LineVisualization
          indicator={indicator}
          data={data}
          title={title}
          height={height}
        />
      );

    case "kpi":
      return (
        <KPIVisualization indicator={indicator} data={data} title={title} />
      );

    default:
      return (
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-500">Unknown chart type</p>
        </div>
      );
  }
};

/**
 * Bar Chart Visualization Component
 * Best for comparing values across categories or comparing male vs female
 */
const BarVisualization: React.FC<{
  indicator: IndicatorMetadata;
  data: any;
  title?: string;
  height: number;
}> = ({ indicator, data, title, height }) => {
  // If data is array of objects with name/state field
  const chartData = Array.isArray(data) ? data : [];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {title || indicator.label}
      </h2>
      <p className="text-xs text-gray-500 mb-4">{indicator.description}</p>

      {chartData.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-gray-400">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey={chartData[0]?.state ? "state" : "name"}
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{ value: indicator.unit || "Value", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              formatter={(value: any) => {
                if (indicator.unit === "₦") return `₦${value?.toLocaleString()}`;
                if (indicator.unit === "%") return `${value}%`;
                return value;
              }}
              labelFormatter={(label) => `State: ${label}`}
            />
            <Legend />

            {/* For gender gap or gap type, show single bar */}
            {indicator.type === "gap" || indicator.type === "mixed" ? (
              <Bar dataKey={indicator.dataKey || "value"} fill={COLORS[0]} radius={[8, 8, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            ) : (
              <>
                {/* For single gender, show bars for comparison */}
                <Bar dataKey={indicator.dataKey || "value"} fill={COLORS[0]} radius={[8, 8, 0, 0]} />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      )}

      {indicator.helpText && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">💡 {indicator.helpText}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Pie Chart Visualization Component
 * Best for showing distribution/proportions (sectors, categories)
 */
const PieVisualization: React.FC<{
  indicator: IndicatorMetadata;
  data: any;
  title?: string;
  height: number;
}> = ({ indicator, data, title, height }) => {
  const chartData = Array.isArray(data) ? data : [];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {title || indicator.label}
      </h2>
      <p className="text-xs text-gray-500 mb-4">{indicator.description}</p>

      {chartData.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-gray-400">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }) => {
                const total = chartData.reduce((acc: number, d: any) => acc + d.value, 0);
                const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return `${name}: ${percent}%`;
              }}
            >
              {chartData.map((_, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: "white", border: "1px solid #ccc", borderRadius: "4px" }}
              formatter={(value: any) => {
                const total = chartData.reduce((acc: number, d: any) => acc + d.value, 0);
                const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return [`${value} (${percent}%)`, "Value"];
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}

      {indicator.helpText && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">💡 {indicator.helpText}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Line Chart Visualization Component
 * Best for time-series data
 */
const LineVisualization: React.FC<{
  indicator: IndicatorMetadata;
  data: any;
  title?: string;
  height: number;
}> = ({ indicator, data, title, height }) => {
  const chartData = Array.isArray(data) ? data : [];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {title || indicator.label}
      </h2>
      <p className="text-xs text-gray-500 mb-4">{indicator.description}</p>

      {chartData.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-gray-400">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={chartData[0]?.year ? "year" : "month"} />
            <YAxis
              label={{ value: indicator.unit || "Value", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={indicator.dataKey || "value"}
              stroke={COLORS[0]}
              strokeWidth={2}
              dot={{ fill: COLORS[0], r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {indicator.helpText && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">💡 {indicator.helpText}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Map Visualization Component
 * Best for geographic data - placeholder for now
 */
const MapVisualization: React.FC<{
  indicator: IndicatorMetadata;
  data: any;
  title?: string;
  height: number;
  onDrillDown?: (drill: string) => void;
}> = ({ indicator, data, title, height, onDrillDown }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {title || indicator.label}
      </h2>
      <p className="text-xs text-gray-500 mb-4">{indicator.description}</p>

      <div
        className="bg-gray-100 rounded-lg flex items-center justify-center text-gray-600"
        style={{ height: `${height}px` }}
      >
        <div className="text-center">
          <p className="text-lg font-medium mb-2">🗺️ Geographic Visualization</p>
          <p className="text-sm text-gray-500">
            Map component integration available
            <br />
            (NigeriaMap / StateMap / LGAMap)
          </p>
        </div>
      </div>

      {indicator.helpText && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">💡 {indicator.helpText}</p>
        </div>
      )}
    </div>
  );
};

/**
 * KPI Visualization Component
 * Best for single key metrics
 */
const KPIVisualization: React.FC<{
  indicator: IndicatorMetadata;
  data: any;
  title?: string;
}> = ({ indicator, data, title }) => {
  const value = typeof data === "number" ? data : data?.value || 0;

  return (
    <div className="w-full">
      <KPICard
        label={title || indicator.label}
        value={value}
        unit={indicator.unit}
        description={indicator.description}
        color="bg-gradient-to-br from-green-50 to-emerald-100"
      />
      {indicator.helpText && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">💡 {indicator.helpText}</p>
        </div>
      )}
    </div>
  );
};
