"use client";

import React from "react";
import {
  GENDER_DASHBOARD_DATA,
  GENDER_DASHBOARD_META,
  calculatePillarAverage,
  type PillarId,
} from "@/app/lib/gender-dashboard";

type PillarSelection = PillarId | "overview";

interface ScoreCardsProps {
  activeState: string;
  selectedPillar: PillarSelection;
  onPillarSelect: (pillar: PillarSelection) => void;
}

export function ScoreCards({
  activeState,
  selectedPillar,
  onPillarSelect,
}: ScoreCardsProps) {
  const stateData = GENDER_DASHBOARD_DATA[activeState];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
      {GENDER_DASHBOARD_META.pillars.map((pillar) => {
        const average = calculatePillarAverage(stateData, pillar.id);
        const count = Object.keys(stateData?.[pillar.id] ?? {}).length;

        return (
          <button
            key={pillar.id}
            onClick={() => onPillarSelect(pillar.id)}
            className="rounded-lg border bg-white p-3 text-left"
            style={{
              borderColor: selectedPillar === pillar.id ? pillar.color : "#D1FAE5",
            }}
          >
            <p className="text-[10px] uppercase tracking-wide" style={{ color: pillar.color }}>{pillar.label}</p>
            <p className="mt-1 text-2xl font-semibold text-black">{average ? average.toFixed(1) : "-"}</p>
            <p className="text-[11px] text-slate-800">{count} indicators</p>
          </button>
        );
      })}
    </div>
  );
}
