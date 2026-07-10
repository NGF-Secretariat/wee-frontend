"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";
import {
  AVAILABLE_YEARS,
  GENDER_DASHBOARD_DATA,
  GENDER_DASHBOARD_META,
  getZoneForState,
  normalizeTopbarState,
  type IndicatorValue,
  type PillarId,
} from "@/app/lib/gender-dashboard";

import { StateSidebar } from "./StateSidebar";
import { StateHeader } from "./StateHeader";
import { ScoreCards } from "./ScoreCards";
import { IndicatorCards } from "./IndicatorCards";
import { IndicatorTable } from "./IndicatorTable";
import { CompareSection } from "./CompareSection";

const MAX_COMPARE = 36;
const DEFAULT_STATE = "Lagos";
const ROWS_PER_PAGE = 12;

type ViewMode = "cards" | "table" | "compare";
type PillarSelection = PillarId | "overview";

export function DataDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedState, selectedYear, setSelectedState, selectedCompareStates, setSelectedCompareStates } = useTopbarFilters();
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [tablePage, setTablePage] = useState(1);
  const pillarParam = searchParams.get("pillar");
  const validPillarIds = new Set(["overview", ...GENDER_DASHBOARD_META.pillars.map((item) => item.id)]);
  const selectedPillar: PillarSelection = validPillarIds.has(pillarParam as PillarSelection)
    ? (pillarParam as PillarSelection)
    : "overview";

  const activeState = useMemo(() => {
    const normalized = normalizeTopbarState(selectedState);
    return GENDER_DASHBOARD_DATA[normalized] ? normalized : DEFAULT_STATE;
  }, [selectedState]);

  const activeStateData = GENDER_DASHBOARD_DATA[activeState];
  const overviewEntries = useMemo(() => {
    if (!activeStateData) return [] as Array<[string, IndicatorValue, string]>;
    return GENDER_DASHBOARD_META.pillars.flatMap((pillar) =>
      Object.entries(activeStateData[pillar.id] ?? {})
        .slice(0, 2)
        .map(([name, item]) => [name, item, pillar.label] as [string, IndicatorValue, string])
    );
  }, [activeStateData]);
  const indicatorEntries = useMemo(
    () => selectedPillar === "overview"
      ? overviewEntries.map(([name, item]) => [name, item] as [string, IndicatorValue])
      : Object.entries(activeStateData?.[selectedPillar] ?? {}),
    [activeStateData, overviewEntries, selectedPillar]
  );

  const totalPages = Math.max(1, Math.ceil(indicatorEntries.length / ROWS_PER_PAGE));
  const pagedRows = indicatorEntries.slice((tablePage - 1) * ROWS_PER_PAGE, tablePage * ROWS_PER_PAGE);

  const compareStates = useMemo(() => {
    if (selectedPillar === "overview") return [activeState];
    const unique = [activeState, ...selectedCompareStates.filter((s) => s !== activeState)];
    return unique.slice(0, MAX_COMPARE + 1);
  }, [activeState, selectedCompareStates, selectedPillar]);

  const currentPillarMeta = selectedPillar === "overview"
    ? { id: "econ" as PillarId, label: "Quick Overview", color: "var(--color-ngf-green)" }
    : GENDER_DASHBOARD_META.pillars.find((item) => item.id === selectedPillar)!;
  const zone = getZoneForState(activeState);
  const isYearAvailable = AVAILABLE_YEARS.includes(selectedYear);

  const toggleCompare = (state: string) => {
    setSelectedCompareStates((prev: string[]) => {
      if (prev.includes(state)) return prev.filter((item) => item !== state);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, state];
    });
  };

  const toggleZone = (states: string[]) => {
    setSelectedCompareStates((prev: string[]) => {
      const allIn = states.every((s) => prev.includes(s));
      if (allIn) {
        return prev.filter((s) => !states.includes(s));
      } else {
        const toAdd = states.filter((s) => !prev.includes(s));
        return [...prev, ...toAdd].slice(0, MAX_COMPARE);
      }
    });
  };

  const resetTablePage = () => setTablePage(1);
  const handlePillarSelect = (pillar: PillarSelection) => {
    router.push(`/dashboard/data?pillar=${pillar}`);
    resetTablePage();
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-2xl border border-emerald-100 bg-[#F0FDF4] p-5 text-black">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">NGF Gender Dashboard</h1>
          </div>
        </div>
        {!isYearAvailable && (
          <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            No dataset for {selectedYear}. Showing 2022 values.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[240px_1fr]">
        <StateSidebar
          selectedPillar={selectedPillar}
          activeState={activeState}
          selectedCompare={selectedCompareStates}
          onPillarSelect={handlePillarSelect}
          onStateSelect={setSelectedState}
          onToggleCompare={toggleCompare}
          onToggleZone={toggleZone}
        />

        <section className="space-y-4">
          <StateHeader
            activeState={activeState}
            zone={zone.label}
            pillarLabel={currentPillarMeta.label}
            count={indicatorEntries.length}
            viewMode={viewMode}
            selectedPillar={selectedPillar}
            compareCount={selectedCompareStates.length}
            onViewChange={setViewMode}
          />

          <ScoreCards activeState={activeState} selectedPillar={selectedPillar} onPillarSelect={handlePillarSelect} />

          {viewMode === "cards" && (
            <IndicatorCards
              entries={indicatorEntries}
              color={currentPillarMeta.color}
              overviewMeta={selectedPillar === "overview" ? overviewEntries : undefined}
            />
          )}
          {viewMode === "table" && (
            <IndicatorTable
              rows={pagedRows}
              page={tablePage}
              totalPages={totalPages}
              onPageChange={setTablePage}
            />
          )}
          {viewMode === "compare" && selectedPillar !== "overview" && (
            <CompareSection compareStates={compareStates} pillar={selectedPillar} color={currentPillarMeta.color} />
          )}
        </section>
      </div>
    </div>
  );
}
