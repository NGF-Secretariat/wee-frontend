"use client";

import React from "react";
import { GENDER_DASHBOARD_META, type PillarId } from "@/app/lib/gender-dashboard";

type PillarSelection = PillarId | "overview";

interface StateSidebarProps {
  selectedPillar: PillarSelection;
  activeState: string;
  selectedCompare: string[];
  onPillarSelect: (pillar: PillarSelection) => void;
  onStateSelect: (state: string) => void;
  onToggleCompare: (state: string) => void;
  onToggleZone: (states: string[]) => void;
}

export function StateSidebar({
  selectedPillar,
  activeState,
  selectedCompare,
  onPillarSelect,
  onStateSelect,
  onToggleCompare,
  onToggleZone,
}: StateSidebarProps) {
  return (
    <aside className="max-h-[80vh] overflow-auto rounded-xl border border-emerald-100 bg-[#F0FDF4] p-3 text-sm text-black">
      <div className="mb-4">
        <p className="mb-2 text-xs uppercase tracking-widest text-slate-800">Tabs</p>
        <div className="space-y-1">
          <button
            onClick={() => onPillarSelect("overview")}
            className="block w-full rounded px-2 py-2 text-left text-xs transition-colors"
            style={{
              color: selectedPillar === "overview" ? "#FFFFFF" : "#91A0BC",
              backgroundColor: selectedPillar === "overview" ? "#06923E" : "transparent",
            }}
          >
            Dashboard Overview
          </button>
          {GENDER_DASHBOARD_META.pillars.map((pillar) => (
            <button
              key={pillar.id}
              onClick={() => onPillarSelect(pillar.id)}
              className="block w-full rounded px-2 py-2 text-left text-xs transition-colors"
              style={{
                color: selectedPillar === pillar.id ? "#FFFFFF" : "#91A0BC",
                backgroundColor: selectedPillar === pillar.id ? "#06923E" : "transparent",
              }}
            >
              {pillar.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 border-b border-emerald-50 pb-2">
        <p className="text-xs uppercase tracking-widest text-slate-800 font-bold">Zones</p>
        <button
          onClick={() => onToggleZone(Object.values(GENDER_DASHBOARD_META.zones).flatMap(z => z.states).map(s => s === "FCT" ? "Federal Capital Territory" : s))}
          className="text-[12px] font-medium text-ngf-green hover:underline cursor-pointer hover:text-ngf-green-dark"
        >
          Select All States
        </button>
      </div>

      {Object.entries(GENDER_DASHBOARD_META.zones).map(([code, zone]) => {
        const zoneStates = zone.states.map(s => s === "FCT" ? "Federal Capital Territory" : s);
        const allInZoneSelected = zoneStates.every(s => selectedCompare.includes(s));

        return (
          <div key={code} className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs uppercase tracking-widest text-slate-800">{zone.label}</p>
              <button
                onClick={() => onToggleZone(zoneStates)}
                className={`text-[10px] font-medium transition-colors cursor-pointer ${allInZoneSelected ? "text-ngf-green" : "text-slate-600 hover:text-ngf-green-dark"}`}
              >
                {allInZoneSelected ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="space-y-1">
              {zone.states.slice().sort().map((state) => (
                <div key={state} className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => onStateSelect(state === "FCT" ? "Federal Capital Territory" : state)}
                    className={`text-xs transition-colors ${state === activeState ? "text-[#06923E] font-medium" : "text-slate-800"} hover:text-[#06923E]`}
                  >
                    {state}
                  </button>
                  <button
                    onClick={() => onToggleCompare(state)}
                    className={`rounded px-2 py-1 text-[10px] transition-colors ${selectedCompare.includes(state) ? "bg-[#06923E] text-white" : "bg-white text-slate-800 hover:bg-emerald-50 border border-emerald-100"}`}
                  >
                    {selectedCompare.includes(state) ? "On" : "Add"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </aside>
  );
}
