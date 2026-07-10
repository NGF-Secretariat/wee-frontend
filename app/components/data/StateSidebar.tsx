"use client";

import React, { useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <aside className="max-h-[85vh] flex flex-col overflow-hidden rounded-2xl border border-emerald-100/50 bg-[#F0FDF4]/80 backdrop-blur-md p-4 text-sm text-black shadow-lg shadow-emerald-950/5">
      {/* Sections Selector */}
      <div className="mb-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#065F46] opacity-75">Dashboard Categories</p>
        <div className="space-y-1">
          <button
            onClick={() => onPillarSelect("overview")}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition-all duration-300 transform active:scale-95 hover:bg-emerald-50 cursor-pointer"
            style={{
              color: selectedPillar === "overview" ? "#FFFFFF" : "#065F46",
              backgroundColor: selectedPillar === "overview" ? "#06923E" : "transparent",
              boxShadow: selectedPillar === "overview" ? "0 4px 12px -2px rgba(6, 146, 62, 0.3)" : "none",
            }}
          >
            <span>Overview Dashboard</span>
            {selectedPillar === "overview" && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
          </button>
          
          {GENDER_DASHBOARD_META.pillars.map((pillar) => (
            <button
              key={pillar.id}
              onClick={() => onPillarSelect(pillar.id)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition-all duration-300 transform active:scale-95 hover:bg-emerald-50 cursor-pointer"
              style={{
                color: selectedPillar === pillar.id ? "#FFFFFF" : "#065F46",
                backgroundColor: selectedPillar === pillar.id ? "#06923E" : "transparent",
                boxShadow: selectedPillar === pillar.id ? "0 4px 12px -2px rgba(6, 146, 62, 0.3)" : "none",
              }}
            >
              <span>{pillar.label}</span>
              {selectedPillar === pillar.id && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
            </button>
          ))}
        </div>
      </div>

      {/* State Search */}
      <div className="mb-4">
        <label htmlFor="state-search" className="sr-only">Search State</label>
        <div className="relative">
          <input
            id="state-search"
            type="text"
            placeholder="Search state..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full rounded-xl border border-emerald-200 bg-white/95 px-3.5 py-2 pl-9 text-xs text-black placeholder-emerald-800/40 focus:border-[#06923E] focus:outline-none focus:ring-1 focus:ring-[#06923E] transition-all"
          />
          <svg
            className="absolute left-3 top-2.5 h-3.5 w-3.5 text-emerald-800/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Collapsible/Scrollable Zones & States */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-200/50 pb-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#065F46] opacity-75">Geopolitical Zones</p>
          <button
            onClick={() => onToggleZone(Object.values(GENDER_DASHBOARD_META.zones).flatMap(z => z.states).map(s => s === "FCT" ? "Federal Capital Territory" : s))}
            className="text-[10px] font-bold text-[#06923E] hover:text-[#047857] hover:underline cursor-pointer transition-colors"
          >
            Select All
          </button>
        </div>

        {Object.entries(GENDER_DASHBOARD_META.zones).map(([code, zone]) => {
          const zoneStates = zone.states.map(s => s === "FCT" ? "Federal Capital Territory" : s);
          
          // Filter states based on search term
          const filteredStates = zone.states.filter((state) =>
            state.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (state === "FCT" && "federal capital territory".includes(searchTerm.toLowerCase()))
          );

          if (filteredStates.length === 0) return null;

          const allInZoneSelected = zoneStates.every(s => selectedCompare.includes(s));

          return (
            <div key={code} className="rounded-xl border border-emerald-100/30 bg-white/40 p-2.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900/60">{zone.label}</span>
                <button
                  onClick={() => onToggleZone(zoneStates)}
                  className={`text-[9px] font-bold transition-all px-1.5 py-0.5 rounded cursor-pointer ${allInZoneSelected ? "bg-emerald-100 text-emerald-800" : "text-emerald-700 hover:bg-emerald-50"}`}
                >
                  {allInZoneSelected ? "Clear" : "All"}
                </button>
              </div>
              <div className="space-y-1">
                {filteredStates.slice().sort().map((state) => {
                  const resolvedStateName = state === "FCT" ? "Federal Capital Territory" : state;
                  const isStateActive = resolvedStateName === activeState;
                  const isStateCompare = selectedCompare.includes(state);

                  return (
                    <div key={state} className="flex items-center justify-between gap-2 group">
                      <button
                        onClick={() => onStateSelect(resolvedStateName)}
                        className={`text-left text-xs transition-all duration-200 truncate flex-1 py-1 rounded px-1.5 cursor-pointer ${
                          isStateActive
                            ? "bg-emerald-600 text-white font-semibold shadow-sm"
                            : "text-emerald-950 hover:bg-emerald-50 hover:text-emerald-800"
                        }`}
                      >
                        {state}
                      </button>
                      <button
                        onClick={() => onToggleCompare(state)}
                        className={`rounded-lg px-2 py-1 text-[9px] font-bold transition-all duration-200 ${
                          isStateCompare
                            ? "bg-[#06923E] text-white shadow-sm"
                            : "bg-white text-emerald-800 border border-emerald-200/50 hover:bg-emerald-50 group-hover:opacity-100 md:opacity-60"
                        }`}
                      >
                        {isStateCompare ? "On" : "Add"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
