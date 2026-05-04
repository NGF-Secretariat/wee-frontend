"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";
import {
  AVAILABLE_YEARS,
  calculatePillarAverage,
  formatValue,
  GENDER_DASHBOARD_DATA,
  GENDER_DASHBOARD_META,
  getZoneForState,
  normalizeTopbarState,
  type IndicatorValue,
  type PillarId,
} from "@/app/lib/gender-dashboard";

const MAX_COMPARE = 5;
const DEFAULT_STATE = "Lagos";
const ROWS_PER_PAGE = 12;

type ViewMode = "cards" | "table" | "compare";
type PillarSelection = PillarId | "overview";

export function DataDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedState, selectedYear, setSelectedYear, setSelectedState } = useTopbarFilters();
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [selectedCompareStates, setSelectedCompareStates] = useState<string[]>([]);
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
    ? { id: "econ" as PillarId, label: "Quick Overview", color: "#3DFFA0" }
    : GENDER_DASHBOARD_META.pillars.find((item) => item.id === selectedPillar)!;
  const zone = getZoneForState(activeState);
  const isYearAvailable = AVAILABLE_YEARS.includes(selectedYear);

  const toggleCompare = (state: string) => {
    setSelectedCompareStates((prev) => {
      if (prev.includes(state)) return prev.filter((item) => item !== state);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, state];
    });
  };

  const resetTablePage = () => setTablePage(1);
  const handlePillarSelect = (pillar: PillarSelection) => {
    router.push(`/dashboard/data?pillar=${pillar}`);
    resetTablePage();
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-2xl border border-[#1C2535] bg-[#0C1018] p-5 text-[#E2E8F4]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Nigeria Gender Dashboard</h1>
            <p className="text-sm text-[#91A0BC]">NLSS 2022 microdata rendered as reusable components</p>
          </div>
          <select
            value={selectedYear}
            onChange={(event) => setSelectedYear(Number(event.target.value))}
            className="rounded-full border border-[#243044] bg-[#111722] px-3 py-2 text-sm"
          >
            {[...new Set([selectedYear, ...AVAILABLE_YEARS])].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        {!isYearAvailable && (
          <p className="mt-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
            No NLSS dataset for {selectedYear}. Showing 2022 values.
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

function StateSidebar({
  selectedPillar,
  activeState,
  selectedCompare,
  onPillarSelect,
  onStateSelect,
  onToggleCompare,
}: {
  selectedPillar: PillarSelection;
  activeState: string;
  selectedCompare: string[];
  onPillarSelect: (pillar: PillarId) => void;
  onStateSelect: (state: string) => void;
  onToggleCompare: (state: string) => void;
}) {
  return (
    <aside className="max-h-[80vh] overflow-auto rounded-xl border border-[#1C2535] bg-[#0C1018] p-3 text-sm text-[#E2E8F4]">
      <div className="mb-4">
        <p className="mb-2 text-xs uppercase tracking-widest text-[#4A5A78]">Tabs</p>
        <div className="space-y-1">
          <button
            onClick={() => onPillarSelect("overview")}
            className="block w-full rounded px-2 py-2 text-left text-xs"
            style={{
              color: selectedPillar === "overview" ? "#3DFFA0" : "#91A0BC",
              backgroundColor: selectedPillar === "overview" ? "rgba(255,255,255,0.05)" : "transparent",
            }}
          >
            Dashboard Overview
          </button>
          {GENDER_DASHBOARD_META.pillars.map((pillar) => (
            <button
              key={pillar.id}
              onClick={() => onPillarSelect(pillar.id)}
              className="block w-full rounded px-2 py-2 text-left text-xs"
              style={{
                color: selectedPillar === pillar.id ? pillar.color : "#91A0BC",
                backgroundColor: selectedPillar === pillar.id ? "rgba(255,255,255,0.05)" : "transparent",
              }}
            >
              {pillar.label}
            </button>
          ))}
        </div>
      </div>

      {Object.entries(GENDER_DASHBOARD_META.zones).map(([code, zone]) => (
        <div key={code} className="mb-3">
          <p className="mb-1 text-xs uppercase tracking-widest text-[#4A5A78]">{zone.label}</p>
          <div className="space-y-1">
            {zone.states.slice().sort().map((state) => (
              <div key={state} className="flex items-center justify-between gap-2">
                <button
                  onClick={() => onStateSelect(state === "FCT" ? "Federal Capital Territory" : state)}
                  className={`text-xs ${state === activeState ? "text-[#3DFFA0]" : "text-[#91A0BC]"}`}
                >
                  {state}
                </button>
                <button
                  onClick={() => onToggleCompare(state)}
                  className={`rounded px-2 py-1 text-[10px] ${selectedCompare.includes(state) ? "bg-[#173f2b] text-[#3DFFA0]" : "bg-[#111722] text-[#91A0BC]"}`}
                >
                  {selectedCompare.includes(state) ? "On" : "Add"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}

function StateHeader({
  activeState,
  zone,
  pillarLabel,
  count,
  viewMode,
  selectedPillar,
  compareCount,
  onViewChange,
}: {
  activeState: string;
  zone: string;
  pillarLabel: string;
  count: number;
  viewMode: ViewMode;
  selectedPillar: PillarSelection;
  compareCount: number;
  onViewChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1C2535] bg-[#0C1018] p-4 text-[#E2E8F4]">
      <div>
        <h2 className="text-3xl font-semibold">{activeState}</h2>
        <p className="text-xs text-[#91A0BC]">{zone} Zone · {pillarLabel} · {count} indicators · NLSS 2022</p>
      </div>
      <div className="flex gap-2">
        {(["cards", "table", "compare"] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onViewChange(mode)}
            disabled={(mode === "compare" && (compareCount === 0 || selectedPillar === "overview"))}
            className={`rounded border px-3 py-2 text-xs uppercase tracking-wide ${viewMode === mode ? "border-[#3DFFA0] text-[#3DFFA0]" : "border-[#243044] text-[#91A0BC]"} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {mode === "compare" ? `Compare (${compareCount})` : mode}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScoreCards({
  activeState,
  selectedPillar,
  onPillarSelect,
}: {
  activeState: string;
  selectedPillar: PillarSelection;
  onPillarSelect: (pillar: PillarSelection) => void;
}) {
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
            className="rounded-lg border bg-[#111722] p-3 text-left"
            style={{
              borderColor: selectedPillar === pillar.id ? pillar.color : "#1C2535",
            }}
          >
            <p className="text-[10px] uppercase tracking-wide" style={{ color: pillar.color }}>{pillar.label}</p>
            <p className="mt-1 text-2xl font-semibold text-[#E2E8F4]">{average ? average.toFixed(1) : "-"}</p>
            <p className="text-[11px] text-[#91A0BC]">{count} indicators</p>
          </button>
        );
      })}
    </div>
  );
}

function IndicatorCards({
  entries,
  color,
  overviewMeta,
}: {
  entries: Array<[string, IndicatorValue]>;
  color: string;
  overviewMeta?: Array<[string, IndicatorValue, string]>;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {entries.map(([name, item]) => (
        <article key={name} className="rounded-lg border border-[#1C2535] bg-[#111722] p-4">
          <div className="mb-2 h-1 rounded" style={{ backgroundColor: color }} />
          <p className="text-sm text-[#91A0BC]">{name}</p>
          <p className="mt-1 text-3xl font-semibold text-[#E2E8F4]">{formatValue(item.value)}</p>
          <p className="text-xs text-[#4A5A78]">{item.unit}</p>
          <div className="mt-3 flex items-center justify-between border-t border-[#1C2535] pt-2 text-[11px] text-[#91A0BC]">
            <span>{item.source}</span>
            <span className="text-[#3DFFA0]">{item.year}</span>
          </div>
          {item.note && <p className="mt-2 text-[11px] italic text-[#4A5A78]">{item.note}</p>}
          {overviewMeta && (
            <p className="mt-2 text-[10px] uppercase tracking-wide text-[#3DFFA0]">
              {overviewMeta.find(([indicatorName]) => indicatorName === name)?.[2] ?? ""}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}

function IndicatorTable({
  rows,
  page,
  totalPages,
  onPageChange,
}: {
  rows: Array<[string, IndicatorValue]>;
  page: number;
  totalPages: number;
  onPageChange: (next: number) => void;
}) {
  return (
    <div className="rounded-lg border border-[#1C2535] bg-[#111722] p-3">
      <table className="w-full text-left text-sm text-[#E2E8F4]">
        <thead>
          <tr className="border-b border-[#1C2535] text-xs uppercase tracking-wide text-[#4A5A78]">
            <th className="py-2">Indicator</th><th>Value</th><th>Unit</th><th>Year</th><th>Source</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, item]) => (
            <tr key={name} className="border-b border-[#1C2535]">
              <td className="py-2">{name}</td>
              <td>{formatValue(item.value)}</td>
              <td>{item.unit}</td>
              <td>{item.year}</td>
              <td>{item.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="rounded border border-[#243044] px-2 py-1 text-xs text-[#91A0BC] disabled:opacity-50">Prev</button>
        <span className="text-xs text-[#91A0BC]">{page}/{totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="rounded border border-[#243044] px-2 py-1 text-xs text-[#91A0BC] disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}

function CompareSection({ compareStates, pillar, color }: { compareStates: string[]; pillar: PillarId; color: string }) {
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
          <div key={indicatorName} className="rounded-lg border border-[#1C2535] bg-[#111722] p-4">
            <p className="mb-2 text-sm text-[#E2E8F4]">{indicatorName}</p>
            <div className="space-y-2">
              {values.map((entry) => (
                <div key={entry.state} className="flex items-center gap-2 text-xs">
                  <span className="w-20 text-right text-[#91A0BC]">{entry.state}</span>
                  <div className="h-4 flex-1 rounded bg-[#1A2438]">
                    <div className="h-4 rounded text-right text-[10px] text-black" style={{ width: `${(entry.value / max) * 100}%`, backgroundColor: color }}>
                      {entry.value.toFixed(1)}
                    </div>
                  </div>
                  <span className="w-10 text-[#91A0BC]">{entry.unit}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
