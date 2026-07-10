"use client";

import React from "react";
import { type PillarId } from "@/app/lib/gender-dashboard";

type ViewMode = "cards" | "charts" | "table" | "compare";
type PillarSelection = PillarId | "overview";

interface StateHeaderProps {
  activeState: string;
  zone: string;
  pillarLabel: string;
  count: number;
  viewMode: ViewMode;
  selectedPillar: PillarSelection;
  compareCount: number;
  onViewChange: (mode: ViewMode) => void;
  rankInfo?: string;
}

export function StateHeader({
  activeState,
  zone,
  pillarLabel,
  count,
  viewMode,
  selectedPillar,
  compareCount,
  onViewChange,
  rankInfo,
}: StateHeaderProps) {
  const views: { mode: ViewMode; label: string }[] = [
    { mode: "cards", label: "Cards View" },
    { mode: "charts", label: "Analytics & Charts" },
    { mode: "table", label: "Data Table" },
    { mode: "compare", label: `Compare (${compareCount})` },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-100/50 bg-[#F0FDF4]/80 backdrop-blur-md p-5 text-black shadow-md shadow-emerald-950/5">
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-3xl font-bold tracking-tight text-emerald-950">{activeState}</h2>
          {rankInfo && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-[#06923E]">
              {rankInfo}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs font-medium text-emerald-900/60 uppercase tracking-wider">
          {zone} Zone · {pillarLabel} · {count} indicators · NLSS 2022
        </p>
      </div>
      
      {/* Premium View Switcher */}
      <div className="flex flex-wrap rounded-xl bg-emerald-100/50 p-1 border border-emerald-200/20">
        {views.map(({ mode, label }) => {
          const isActive = viewMode === mode;
          const isDisabled = mode === "compare" && (compareCount === 0 || selectedPillar === "overview");

          return (
            <button
              key={mode}
              onClick={() => onViewChange(mode)}
              disabled={isDisabled}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#06923E] text-white shadow-sm"
                  : "text-emerald-950 hover:text-[#06923E]"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
