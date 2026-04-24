"use client";

import React, { memo, useMemo, useState } from "react";
import { LGAMap, NigeriaMap } from "@some19ice/nigeria-geo-viz/react";
import { getStateById } from "@some19ice/nigeria-geo-core";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import type { EducationIndicatorMetadata } from "@/app/lib/education-indicator-config";
import {
  getAttainmentData,
  getChoroplethForIndicator,
  getEnrollmentComparisonData,
  getGenderComparisonData,
  getKPIValue,
  getLGAChoropleth,
  getStateSeriesFromMap,
  getStemComparisonData,
} from "@/app/lib/education-mock-data";

const PIE_COLORS = ["#ef4444", "#f59e0b", "#22c55e", "#2563eb", "#7c3aed"];
const BAR_COLORS = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"];

interface SmartEducationChartProps {
  indicator: EducationIndicatorMetadata;
  data: unknown;
}

type DrillLevel = "nigeria" | "state" | "lga";

function SmartEducationChartImpl({ indicator }: SmartEducationChartProps) {
  const [drillLevel, setDrillLevel] = useState<DrillLevel>("nigeria");
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const mapData = useMemo(
    () => getChoroplethForIndicator(indicator.id),
    [indicator.id]
  );

  const lgaData = useMemo(() => {
    if (!selectedStateId) return {};
    return getLGAChoropleth(selectedStateId, indicator.id);
  }, [indicator.id, selectedStateId]);

  const chartContent = useMemo(() => {
    if (indicator.preferredChart === "map") {
      const hoveredValue = hoveredRegion
        ? drillLevel === "lga"
          ? lgaData[hoveredRegion]
          : mapData[hoveredRegion]
        : null;

      const hoveredLabel = hoveredRegion
        ? drillLevel === "lga"
          ? hoveredRegion
          : getStateById(hoveredRegion)?.name ?? hoveredRegion
        : null;

      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {drillLevel === "nigeria" && "Nigeria view: click a state to drill down"}
              {drillLevel === "state" && "State view: click selected state again for LGA view"}
              {drillLevel === "lga" && "LGA view: hover LGAs for details"}
            </div>
            <div className="flex gap-2">
              {drillLevel !== "nigeria" && (
                <button
                  className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    if (drillLevel === "lga") {
                      setDrillLevel("state");
                      return;
                    }
                    setDrillLevel("nigeria");
                    setSelectedStateId(null);
                  }}
                >
                  Back
                </button>
              )}
            </div>
          </div>

          {hoveredLabel && hoveredValue !== undefined && hoveredValue !== null && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              <span className="font-semibold">{hoveredLabel}</span>: {hoveredValue}
              {indicator.unit ? ` ${indicator.unit}` : ""}
            </div>
          )}

          <div className="rounded-xl border border-gray-200 bg-slate-50 p-2" style={{ animation: "fadeIn 240ms ease" }}>
            {drillLevel === "lga" && selectedStateId ? (
              <LGAMap
                width={900}
                height={520}
                stateId={selectedStateId}
                enableHover
                enableSelection
                choroplethData={lgaData}
                onLGAHover={(lgaId) => setHoveredRegion(lgaId)}
                onLGAClick={(lgaId) => setHoveredRegion(lgaId)}
                theme={{
                  backgroundColor: "#f8fafc",
                  defaultFill: "#dcfce7",
                  strokeColor: "#14532d",
                  hoverFill: "#4ade80",
                  selectedFill: "#15803d",
                  labelColor: "#14532d",
                }}
              />
            ) : (
              <NigeriaMap
                width={900}
                height={520}
                enableHover
                enableSelection
                choroplethData={mapData}
                onStateHover={(stateId) => setHoveredRegion(stateId)}
                onStateClick={(stateId) => {
                  if (drillLevel === "nigeria") {
                    setSelectedStateId(stateId);
                    setDrillLevel("state");
                    return;
                  }

                  if (drillLevel === "state" && selectedStateId === stateId) {
                    setDrillLevel("lga");
                  } else {
                    setSelectedStateId(stateId);
                  }
                }}
                theme={{
                  backgroundColor: "#f8fafc",
                  defaultFill: "#dcfce7",
                  strokeColor: "#166534",
                  hoverFill: "#22c55e",
                  selectedFill: "#15803d",
                  labelColor: "#14532d",
                }}
              />
            )}
          </div>
        </div>
      );
    }

    if (indicator.preferredChart === "bar") {
      const genderPair = indicator.pairKey ? getGenderComparisonData(indicator.pairKey) : [];
      const enrollmentBars = indicator.id.includes("girls_enrollment") ? getEnrollmentComparisonData() : [];
      const stemBars = indicator.id.includes("girls_stem") ? getStemComparisonData() : [];
      const singleSeries = getStateSeriesFromMap(mapData).slice(0, 10);

      const isGenderPair = genderPair.length > 0 && (indicator.id.includes("male") || indicator.id.includes("female"));
      const data = isGenderPair ? genderPair : enrollmentBars.length ? enrollmentBars : stemBars.length ? stemBars : singleSeries;

      const xAxisKey = isGenderPair ? "stateName" : "level" in (data[0] || {}) ? "level" : "stateName";
      
      return (
        <div className="rounded-xl border border-gray-200 bg-white p-4" style={{ animation: "fadeIn 240ms ease" }}>
          <ResponsiveContainer width="100%" height={520}>
            <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey={xAxisKey} angle={-25} textAnchor="end" interval={0} height={70} />
              <YAxis />
              <Tooltip formatter={(value: any) => `${value}${indicator.unit ? ` ${indicator.unit}` : ""}`} />
              {isGenderPair ? (
                <>
                  <Bar dataKey="female" fill="#ec4899" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="male" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </>
              ) : (
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {data.map((entry: { level?: string; stateId?: string }, idx: number) => (
                    <Cell
                      key={entry.level || entry.stateId || idx}
                      fill={BAR_COLORS[idx % BAR_COLORS.length]}
                    />
                  ))}
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (indicator.preferredChart === "pie") {
      const pieData = getAttainmentData(indicator.type === "male" ? "male" : "female");

      return (
        <div className="rounded-xl border border-gray-200 bg-white p-4" style={{ animation: "fadeIn 240ms ease" }}>
          <ResponsiveContainer width="100%" height={520}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={165}
                label={(entry) => `${entry.name}: ${entry.value}%`}
              >
                {pieData.map((entry, idx) => (
                  <Cell key={entry.name} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    const kpi = getKPIValue(indicator.id);
    const remainder = Math.max(100 - kpi.value, 0);

    return (
      <div className="grid h-[520px] place-items-center rounded-xl border border-gray-200 bg-white p-4" style={{ animation: "fadeIn 240ms ease" }}>
        <div className="w-full max-w-xl rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">KPI</p>
          <p className="mt-2 text-6xl font-bold text-emerald-900">{kpi.value}%</p>
          <p className="mt-2 text-sm text-gray-600">{kpi.subtitle}</p>

          <div className="mt-8 h-4 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${kpi.value}%` }} />
          </div>
          <div className="mt-3 flex justify-between text-xs text-gray-600">
            <span>Coverage</span>
            <span>Gap: {remainder}%</span>
          </div>
        </div>
      </div>
    );
  }, [drillLevel, hoveredRegion, indicator.id, indicator.pairKey, indicator.preferredChart, indicator.type, indicator.unit, lgaData, mapData, selectedStateId]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">{indicator.label}</h2>
      <p className="mt-1 text-sm text-gray-600">{indicator.description}</p>
      <div className="mt-4">{chartContent}</div>
      <style jsx>{`
        @keyframes fadeIn {
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

export const SmartEducationChart = memo(SmartEducationChartImpl);
