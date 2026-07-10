"use client";

import React from "react";
import { GENDER_DASHBOARD_DATA, type PillarId } from "@/app/lib/gender-dashboard";

interface CompareSectionProps {
  compareStates: string[];
  pillar: PillarId;
  color: string;
}

export function CompareSection({ compareStates, pillar, color }: CompareSectionProps) {
  const baseline = compareStates[0];
  const indicators = Object.entries(GENDER_DASHBOARD_DATA[baseline]?.[pillar] ?? {});

  return (
    <div className="space-y-3">
      {indicators.map(([indicatorName]) => {
        const values = compareStates
          .map((state) => {
            const item = GENDER_DASHBOARD_DATA[state]?.[pillar]?.[indicatorName];
            return { state, value: typeof item?.value === "number" ? item.value : null, unit: item?.unit ?? "" };
          })
          .filter((entry) => entry.value !== null) as Array<{ state: string; value: number; unit: string }>;

        const max = Math.max(...values.map((v) => v.value), 1);

        return (
          <div key={indicatorName} className="rounded-lg border border-emerald-100 bg-white p-4">
            <p className="mb-2 text-sm text-black">{indicatorName}</p>
            <div className="space-y-2">
              {values.map((entry) => (
                <div key={entry.state} className="flex items-center gap-2 text-xs">
                  <span className="w-20 text-right text-slate-800">{entry.state}</span>
                  <div className="h-4 flex-1 rounded bg-[#F0FDF4]">
                    <div className="h-4 rounded text-right text-[10px] text-white font-medium pr-1.5 flex items-center justify-end" style={{ width: `${(entry.value / max) * 100}%`, backgroundColor: color }}>
                      {entry.value.toFixed(1)}
                    </div>
                  </div>
                  <span className="w-10 text-slate-800">{entry.unit}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
