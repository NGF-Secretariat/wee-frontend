"use client";

import React from "react";
import { type PillarId } from "@/app/lib/gender-dashboard";

type ViewMode = "cards" | "table" | "compare";
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
}: StateHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-[#F0FDF4] p-4 text-black">
      <div>
        <h2 className="text-3xl font-semibold">{activeState}</h2>
        <p className="text-xs text-slate-800">{zone} Zone · {pillarLabel} · {count} indicators · NLSS 2022</p>
      </div>
      <div className="flex gap-2">
        {(["cards", "table", "compare"] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onViewChange(mode)}
            disabled={(mode === "compare" && (compareCount === 0 || selectedPillar === "overview"))}
            className={`rounded border px-3 py-2 text-xs uppercase tracking-wide transition-all ${viewMode === mode ? "bg-[#06923E] border-[#06923E] text-white" : "border-[#243044] text-slate-800 hover:border-[#06923E] hover:text-white"} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {mode === "compare" ? `Compare (${compareCount})` : mode}
          </button>
        ))}
      </div>
    </div>
  );
}
