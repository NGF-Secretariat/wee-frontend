"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  GENDER_DASHBOARD_DATA,
  GENDER_DASHBOARD_META,
  calculatePillarAverage,
  getZoneForState,
  type PillarId,
} from "@/app/lib/gender-dashboard";

type PillarSelection = PillarId | "overview";

interface DataChartsViewProps {
  activeState: string;
  selectedPillar: PillarSelection;
  color: string;
}

export function DataChartsView({ activeState, selectedPillar, color }: DataChartsViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const zoneInfo = useMemo(() => getZoneForState(activeState), [activeState]);
  const zoneStates = useMemo(() => {
    const zoneMeta = GENDER_DASHBOARD_META.zones[zoneInfo.code];
    if (!zoneMeta) return [activeState];
    return zoneMeta.states.map((s) => (s === "FCT" ? "Federal Capital Territory" : s));
  }, [zoneInfo, activeState]);

  // Determine active pillar ID
  const pillarId: PillarId = selectedPillar === "overview" ? "econ" : selectedPillar;

  // List of indicators for dropdown
  const indicators = useMemo(() => {
    return Object.entries(GENDER_DASHBOARD_DATA[activeState]?.[pillarId] ?? {});
  }, [activeState, pillarId]);

  const [prevIndicators, setPrevIndicators] = useState(indicators);
  const [selectedIndicator, setSelectedIndicator] = useState(indicators[0]?.[0] || "");

  // Sync state with memoized indicators when indicators change
  if (indicators !== prevIndicators) {
    setPrevIndicators(indicators);
    setSelectedIndicator(indicators[0]?.[0] || "");
  }

  // 1. Radar data: State score vs Zone average across all 7 pillars
  const radarData = useMemo(() => {
    return GENDER_DASHBOARD_META.pillars.map((pillar) => {
      const stateScore = calculatePillarAverage(GENDER_DASHBOARD_DATA[activeState], pillar.id) || 0;
      
      // Calculate Zone average for this pillar
      let zoneSum = 0;
      let zoneCount = 0;
      zoneStates.forEach((st) => {
        const score = calculatePillarAverage(GENDER_DASHBOARD_DATA[st], pillar.id);
        if (score !== null) {
          zoneSum += score;
          zoneCount++;
        }
      });
      const zoneScore = zoneCount > 0 ? zoneSum / zoneCount : 0;

      return {
        subject: pillar.label.split(". ")[1] || pillar.label,
        State: stateScore,
        Zone: zoneScore,
      };
    });
  }, [activeState, zoneStates]);

  // 2. Zone Pillar average comparison data
  const zonePillarData = useMemo(() => {
    return zoneStates.map((st) => {
      const avg = calculatePillarAverage(GENDER_DASHBOARD_DATA[st], pillarId) || 0;
      return {
        state: st === "Federal Capital Territory" ? "FCT" : st,
        value: avg,
      };
    }).sort((a, b) => b.value - a.value);
  }, [zoneStates, pillarId]);

  // 3. Zone Indicator distribution comparison data
  const zoneIndicatorData = useMemo(() => {
    if (!selectedIndicator) return [];
    return zoneStates.map((st) => {
      const item = GENDER_DASHBOARD_DATA[st]?.[pillarId]?.[selectedIndicator];
      return {
        state: st === "Federal Capital Territory" ? "FCT" : st,
        value: typeof item?.value === "number" ? item.value : 0,
        unit: item?.unit || "",
      };
    }).sort((a, b) => b.value - a.value);
  }, [zoneStates, pillarId, selectedIndicator]);

  const unit = GENDER_DASHBOARD_DATA[activeState]?.[pillarId]?.[selectedIndicator]?.unit || "";

  if (!mounted) {
    return <div className="h-64 flex items-center justify-center text-slate-500 animate-pulse">Loading visualizations...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {/* ── Pillar Radar Profile Chart ── */}
      <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-emerald-950">Geopolitical Profile</h3>
          <p className="text-xs text-slate-800">State vs {zoneInfo.label} Zone averages across all 7 pillars</p>
        </div>
        <div className="h-80 w-full mt-4 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#0f172a", fontSize: 10, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 9 }} />
              <Radar
                name={activeState}
                dataKey="State"
                stroke="#06923E"
                fill="#06923E"
                fillOpacity={0.3}
              />
              <Radar
                name={`${zoneInfo.label} Zone`}
                dataKey="Zone"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.15}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-emerald-100 bg-white p-3 shadow-lg text-xs text-slate-800">
                        <p className="font-bold text-emerald-950">{payload[0].payload.subject}</p>
                        {payload.map((entry, idx) => (
                          <p key={idx} className="mt-1 font-semibold" style={{ color: entry.color }}>
                            {entry.name}: <span className="font-bold text-sm">{typeof entry.value === "number" ? entry.value.toFixed(1) : entry.value}%</span>
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-2 text-[10px] justify-center border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded" style={{ backgroundColor: "#06923E" }} />
            <span className="font-bold text-slate-800">{activeState}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded" style={{ backgroundColor: "#f59e0b" }} />
            <span className="font-bold text-slate-800">{zoneInfo.label} Zone</span>
          </div>
        </div>
      </div>

      {/* ── Zone Comparison Chart (Pillar Average) ── */}
      <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-emerald-950">Zone Rankings</h3>
          <p className="text-xs text-slate-800">Pillar averages for all states in the {zoneInfo.label} Zone</p>
        </div>
        <div className="h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={zonePillarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="state" tick={{ fill: "#0f172a", fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip
                cursor={{ fill: "#f0fdf4", opacity: 0.5 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-emerald-100 bg-white p-3 shadow-lg text-xs text-slate-800">
                        <p className="font-bold text-emerald-950">{data.state}</p>
                        <p className="mt-1 font-semibold text-[#06923E]">
                          Average: <span className="font-bold text-sm">{data.value.toFixed(1)}%</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" fill={color} radius={[5, 5, 0, 0]} maxBarSize={30}>
                {zonePillarData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.state === (activeState === "Federal Capital Territory" ? "FCT" : activeState) ? "#06923E" : color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Zone Indicator Distribution comparison ── */}
      {selectedIndicator && (
        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-emerald-950">Indicator Distribution</h3>
              <p className="text-xs text-slate-800">Compare individual indicator values across the geopolitical zone</p>
            </div>
            <div>
              <label htmlFor="indicator-select" className="sr-only">Indicator</label>
              <select
                id="indicator-select"
                value={selectedIndicator}
                onChange={(e) => setSelectedIndicator(e.target.value)}
                className="bg-[#dadcde] text-black border border-[#dadcde] text-xs px-3 py-2.5 rounded-full cursor-pointer font-semibold focus:outline-none focus:ring-1 focus:ring-[#06923E]"
              >
                {indicators.map(([name]) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneIndicatorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="state" tick={{ fill: "#0f172a", fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} unit={unit} />
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
                <Bar dataKey="value" fill={color} radius={[5, 5, 0, 0]} maxBarSize={35}>
                  {zoneIndicatorData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.state === (activeState === "Federal Capital Territory" ? "FCT" : activeState) ? "#06923E" : color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
