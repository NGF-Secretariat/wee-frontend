"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { GENDER_DASHBOARD_DATA, type PillarId } from "@/app/lib/gender-dashboard";

interface CompareSectionProps {
  compareStates: string[];
  pillar: PillarId;
  color: string;
}

export function CompareSection({ compareStates, pillar, color }: CompareSectionProps) {
  const [mounted, setMounted] = useState(false);
  const baseline = compareStates[0];
  const indicators = Object.entries(GENDER_DASHBOARD_DATA[baseline]?.[pillar] ?? {});
  
  const [prevPillar, setPrevPillar] = useState(pillar);
  const [selectedIndicator, setSelectedIndicator] = useState(indicators[0]?.[0] || "");

  // Sync state with props during render instead of effect
  if (pillar !== prevPillar) {
    setPrevPillar(pillar);
    setSelectedIndicator(indicators[0]?.[0] || "");
  }

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (compareStates.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-emerald-200 bg-white p-8 text-center text-slate-500">
        Add states from the sidebar to compare.
      </div>
    );
  }

  // 1. Prepare data for the selected indicator chart
  const chartData = compareStates.map((state) => {
    const item = GENDER_DASHBOARD_DATA[state]?.[pillar]?.[selectedIndicator];
    return {
      state: state === "Federal Capital Territory" ? "FCT" : state,
      value: typeof item?.value === "number" ? item.value : 0,
      unit: item?.unit || "",
    };
  });

  const unit = GENDER_DASHBOARD_DATA[baseline]?.[pillar]?.[selectedIndicator]?.unit || "";

  return (
    <div className="space-y-6">
      {/* ── Interactive Comparative Chart ── */}
      <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-emerald-950">Comparative Visualization</h3>
            <p className="text-xs text-slate-800">Compare values side-by-side across all selected states</p>
          </div>
          {/* Indicator Select Dropdown */}
          <div className="w-full sm:w-auto">
            <label htmlFor="indicator-select" className="sr-only">Choose Indicator</label>
            <select
              id="indicator-select"
              value={selectedIndicator}
              onChange={(e) => setSelectedIndicator(e.target.value)}
              className="w-full bg-[#dadcde] text-black border border-[#dadcde] text-xs px-3.5 py-2.5 rounded-full cursor-pointer font-semibold focus:outline-none focus:ring-1 focus:ring-[#06923E]"
            >
              {indicators.map(([name]) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recharts BarChart container */}
        <div className="h-72 w-full">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="state"
                  tick={{ fill: "#0f172a", fontSize: 11, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  unit={unit}
                />
                <Tooltip
                  cursor={{ fill: "#f0fdf4", opacity: 0.5 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-emerald-100 bg-white p-3 shadow-lg text-xs text-slate-800">
                          <p className="font-bold text-emerald-950">{data.state}</p>
                          <p className="mt-1 font-semibold text-[#06923E]">
                            Value: <span className="font-bold text-sm">{data.value.toFixed(1)}</span> {data.unit}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={45}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? "#06923E" : color} // Highlights baseline state
                      opacity={index === 0 ? 1 : 0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-500 text-xs animate-pulse">
              Loading interactive chart...
            </div>
          )}
        </div>
        
        {/* Baseline legend */}
        <div className="flex items-center gap-4 mt-3 text-[11px] justify-center border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded" style={{ backgroundColor: "#06923E" }} />
            <span className="font-bold text-slate-800">{baseline} (Selected State)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded" style={{ backgroundColor: color }} />
            <span className="font-semibold text-slate-500">Compared States</span>
          </div>
        </div>
      </div>

      {/* ── Full Cross-Comparison Data Sheet ── */}
      <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm overflow-hidden">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-emerald-950">Indicator Comparison Sheet</h3>
          <p className="text-xs text-slate-800">Compare values across all indicators in this category</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs text-black">
            <thead>
              <tr className="border-b border-emerald-100 bg-[#F0FDF4]/30">
                <th className="py-3 px-3 font-bold text-emerald-950 rounded-tl-xl">Indicator</th>
                {compareStates.map((state, idx) => (
                  <th
                    key={state}
                    className={`py-3 px-3 font-bold text-right ${
                      idx === 0 ? "text-[#06923E]" : "text-slate-800"
                    } ${idx === compareStates.length - 1 ? "rounded-tr-xl" : ""}`}
                  >
                    {state}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {indicators.map(([indicatorName, item]) => (
                <tr
                  key={indicatorName}
                  className={`border-b border-slate-100 hover:bg-[#F0FDF4]/10 transition-colors ${
                    indicatorName === selectedIndicator ? "bg-[#F0FDF4]/20" : ""
                  }`}
                >
                  <td
                    className="py-3 px-3 font-medium text-slate-800 max-w-xs md:max-w-sm truncate cursor-pointer hover:text-[#06923E] transition-colors"
                    onClick={() => setSelectedIndicator(indicatorName)}
                  >
                    {indicatorName}
                  </td>
                  {compareStates.map((state, idx) => {
                    const val = GENDER_DASHBOARD_DATA[state]?.[pillar]?.[indicatorName]?.value;
                    const valueStr = typeof val === "number" ? val.toFixed(1) : "-";
                    return (
                      <td
                        key={state}
                        className={`py-3 px-3 text-right font-bold ${
                          idx === 0 ? "text-[#06923E] bg-emerald-50/10" : "text-slate-700"
                        }`}
                      >
                        {valueStr} <span className="text-[10px] font-normal text-slate-400">{item.unit}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
