"use client";

import React, { useMemo } from "react";
import {
  GENDER_DASHBOARD_DATA,
  GENDER_DASHBOARD_META,
  getZoneForState,
  formatValue,
  type IndicatorValue,
  type PillarId,
} from "@/app/lib/gender-dashboard";

type PillarSelection = PillarId | "overview";

interface IndicatorCardsProps {
  entries: Array<[string, IndicatorValue]>;
  color: string;
  overviewMeta?: Array<[string, IndicatorValue, string]>;
  activeState: string;
  selectedPillar: PillarSelection;
}

export function IndicatorCards({
  entries,
  color,
  overviewMeta,
  activeState,
  selectedPillar,
}: IndicatorCardsProps) {
  // 1. Get zone for current state
  const zoneInfo = useMemo(() => getZoneForState(activeState), [activeState]);

  // 2. Get list of states in the same zone
  const zoneStates = useMemo(() => {
    const zoneMeta = GENDER_DASHBOARD_META.zones[zoneInfo.code];
    if (!zoneMeta) return [activeState];
    return zoneMeta.states.map((s) => (s === "FCT" ? "Federal Capital Territory" : s));
  }, [zoneInfo, activeState]);

  // 3. For each indicator, compute zone average and national average
  const averages = useMemo(() => {
    const result: Record<string, { zoneAvg: number | null; natAvg: number | null }> = {};

    entries.forEach(([name]) => {
      // Find the pillar for this indicator. 
      // If selectedPillar is "overview", we find which pillar this indicator belongs to
      let pillarId: PillarId = "econ";
      if (selectedPillar === "overview") {
        if (overviewMeta) {
          const match = overviewMeta.find(([indName]) => indName === name);
          if (match) {
            // Find pillar id based on label
            const pMeta = GENDER_DASHBOARD_META.pillars.find((p) => p.label === match[2]);
            if (pMeta) pillarId = pMeta.id;
          }
        }
      } else {
        pillarId = selectedPillar;
      }

      // Compute zone average
      let zoneSum = 0;
      let zoneCount = 0;
      zoneStates.forEach((stateName) => {
        const val = GENDER_DASHBOARD_DATA[stateName]?.[pillarId]?.[name]?.value;
        if (typeof val === "number") {
          zoneSum += val;
          zoneCount++;
        }
      });
      const zoneAvg = zoneCount > 0 ? zoneSum / zoneCount : null;

      // Compute national average
      let natSum = 0;
      let natCount = 0;
      Object.keys(GENDER_DASHBOARD_DATA).forEach((stateName) => {
        const val = GENDER_DASHBOARD_DATA[stateName]?.[pillarId]?.[name]?.value;
        if (typeof val === "number") {
          natSum += val;
          natCount++;
        }
      });
      const natAvg = natCount > 0 ? natSum / natCount : null;

      result[name] = { zoneAvg, natAvg };
    });

    return result;
  }, [entries, zoneStates, selectedPillar, overviewMeta]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {entries.map(([name, item]) => {
        const stateVal = typeof item.value === "number" ? item.value : null;
        const indAverages = averages[name] || { zoneAvg: null, natAvg: null };
        const { zoneAvg, natAvg } = indAverages;

        // Calculate max value for sparkline scaling
        const valuesList = [stateVal, zoneAvg, natAvg].filter((v): v is number => v !== null);
        const maxVal = valuesList.length > 0 ? Math.max(...valuesList) * 1.15 : 100;

        // Determine performance status tag relative to national average
        let performanceTag = "";
        let tagColor = "bg-slate-100 text-slate-700 border-slate-200";

        if (stateVal !== null && natAvg !== null) {
          const ratio = stateVal / natAvg;
          if (ratio >= 1.05) {
            performanceTag = "Above Average";
            tagColor = "bg-emerald-50 text-emerald-700 border-emerald-200/50";
          } else if (ratio <= 0.95) {
            performanceTag = "Below Average";
            tagColor = "bg-rose-50 text-rose-700 border-rose-200/50";
          } else {
            performanceTag = "Average";
            tagColor = "bg-amber-50 text-amber-700 border-amber-200/50";
          }
        }

        return (
          <article
            key={name}
            className="flex flex-col justify-between rounded-2xl border border-emerald-100/50 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
          >
            {/* Theme bar indicator */}
            <div className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5" style={{ backgroundColor: color }} />
            
            {/* Header / Title */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-relaxed">{name}</p>
                {performanceTag && (
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${tagColor}`}>
                    {performanceTag}
                  </span>
                )}
              </div>

              {/* Large Value Display */}
              <div className="flex items-baseline gap-1.5">
                <p className="text-3xl font-bold tracking-tight text-slate-900">
                  {formatValue(item.value)}
                </p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {item.unit}
                </p>
              </div>
            </div>

            {/* Micro Analytic Sparkline/Bars */}
            {stateVal !== null && (
              <div className="my-4 border-t border-b border-slate-100 py-3 space-y-2">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-800 mb-2">Regional Benchmark</p>
                
                {/* State Value Bar */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-900">
                    <span className="font-semibold">{activeState} (This State)</span>
                    <span className="font-bold">{stateVal.toFixed(1)}{item.unit}</span>
                  </div>
                  <div className="h-1.5 w-full rounded bg-slate-100">
                    <div
                      className="h-1.5 rounded transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (stateVal / maxVal) * 100)}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>

                {/* Zone Average Bar */}
                {zoneAvg !== null && (
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-900">
                      <span>{zoneInfo.label} Zone Avg</span>
                      <span className="font-bold">{zoneAvg.toFixed(1)}{item.unit}</span>
                    </div>
                    <div className="h-1.5 w-full rounded bg-slate-100">
                      <div
                        className="h-1.5 rounded bg-emerald-900/40 transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (zoneAvg / maxVal) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* National Average Bar */}
                {natAvg !== null && (
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-900">
                      <span>National Average</span>
                      <span className="font-bold">{natAvg.toFixed(1)}{item.unit}</span>
                    </div>
                    <div className="h-1.5 w-full rounded bg-slate-100">
                      <div
                        className="h-1.5 rounded bg-slate-400 transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (natAvg / maxVal) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer Metadata */}
            <div className="flex items-center justify-between text-[10px] text-slate-800">
              <span className="font-medium truncate max-w-[70%]">{item.source}</span>
              <span className="font-bold text-[#06923E] shrink-0 bg-emerald-50 border border-emerald-100/50 rounded px-1.5 py-0.5">
                {item.year}
              </span>
            </div>

            {/* Optional Note */}
            {item.note && (
              <p className="mt-2.5 text-[9px] italic text-slate-800 bg-slate-50 border border-slate-100 rounded p-1.5 leading-relaxed">
                {item.note}
              </p>
            )}

            {/* Overview category tag */}
            {overviewMeta && (
              <p className="mt-3 text-[9px] font-bold uppercase tracking-wider text-[#06923E]">
                {overviewMeta.find(([indicatorName]) => indicatorName === name)?.[2] ?? ""}
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}
