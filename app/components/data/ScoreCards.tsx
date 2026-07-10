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
        const isSelected = selectedPillar === pillar.id;

        // Circular progress circle parameters
        const radius = 14;
        const circumference = 2 * Math.PI * radius;
        const val = average || 0;
        const strokeDashoffset = circumference - (val / 100) * circumference;

        return (
          <button
            key={pillar.id}
            onClick={() => onPillarSelect(pillar.id)}
            className="group relative flex flex-col justify-between rounded-xl border bg-white p-3 text-left transition-all duration-300 transform active:scale-95 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            style={{
              borderColor: isSelected ? pillar.color : "#E2E8F0",
              boxShadow: isSelected ? `0 4px 14px -4px ${pillar.color}40` : "none",
            }}
          >
            {/* Header info */}
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider transition-colors duration-200" style={{ color: isSelected ? pillar.color : "#64748B" }}>
                {pillar.label.split(". ")[1] || pillar.label}
              </p>
            </div>

            {/* Score & Gauge Section */}
            <div className="mt-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-2xl font-bold tracking-tight text-slate-900">
                  {average ? average.toFixed(1) : "-"}
                </p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">{count} Indicators</p>
              </div>

              {/* Pure SVG Radial Gauge */}
              {average !== null && (
                <div className="relative h-10 w-10 shrink-0">
                  <svg className="h-full w-full -rotate-90">
                    {/* Background Circle */}
                    <circle
                      cx="20"
                      cy="20"
                      r={radius}
                      className="stroke-slate-100"
                      strokeWidth="2.5"
                      fill="transparent"
                    />
                    {/* Progress Circle */}
                    <circle
                      cx="20"
                      cy="20"
                      r={radius}
                      stroke={pillar.color}
                      strokeWidth="2.5"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-slate-500">
                    %
                  </span>
                </div>
              )}
            </div>

            {/* Subtle bottom line for selected */}
            {isSelected && (
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl" style={{ backgroundColor: pillar.color }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
