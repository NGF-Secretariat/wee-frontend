import rawData from "./data/gender-dashboard-data.json";
import rawMeta from "./data/gender-dashboard-meta.json";


export type PillarId = "econ" | "edu" | "soc" | "health" | "pol" | "legal" | "data";

export interface IndicatorValue {
  value: number | string | null;
  unit: string;
  source: string;
  year: string;
  isStateLevel: boolean;
  confidence: string;
  note: string;
}

export type StatePillarIndicators = Record<string, IndicatorValue>;
export type StateDataset = Record<PillarId, StatePillarIndicators>;
export type GenderDashboardData = Record<string, StateDataset>;

export interface PillarMeta {
  id: PillarId;
  label: string;
  color: string;
}

export interface ZoneMeta {
  label: string;
  states: string[];
}

export interface GenderDashboardMeta {
  pillars: PillarMeta[];
  zones: Record<string, ZoneMeta>;
}

export const GENDER_DASHBOARD_DATA = rawData as GenderDashboardData;
export const GENDER_DASHBOARD_META = rawMeta as GenderDashboardMeta;

export const AVAILABLE_YEARS = [2022];

export function normalizeTopbarState(state: string): string {
  if (!state) return "Lagos";
  if (state === "Federal Capital Territory") return "FCT";
  return state;
}

export function getZoneForState(state: string): { code: string; label: string } {
  for (const [code, zone] of Object.entries(GENDER_DASHBOARD_META.zones)) {
    if (zone.states.includes(state)) {
      return { code, label: zone.label };
    }
  }

  return { code: "NA", label: "Unassigned" };
}

export function flattenIndicators(data: GenderDashboardData) {
  const rows: Array<{
    state: string;
    pillar: PillarId;
    indicator: string;
    value: number | string | null;
    unit: string;
    source: string;
    year: string;
    note: string;
  }> = [];

  for (const [state, stateData] of Object.entries(data)) {
    for (const [pillar, indicators] of Object.entries(stateData) as Array<[PillarId, StatePillarIndicators]>) {
      for (const [indicator, item] of Object.entries(indicators)) {
        rows.push({
          state,
          pillar,
          indicator,
          value: item.value,
          unit: item.unit,
          source: item.source,
          year: item.year,
          note: item.note,
        });
      }
    }
  }

  return rows;
}

export function calculatePillarAverage(stateData: StateDataset | undefined, pillarId: PillarId) {
  const indicators = stateData?.[pillarId];
  if (!indicators) return null;

  const numeric = Object.values(indicators)
    .map((item) => item.value)
    .filter((v): v is number => typeof v === "number");

  if (!numeric.length) return null;
  return numeric.reduce((sum, current) => sum + current, 0) / numeric.length;
}

export function formatValue(value: number | string | null) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "number") {
    return Number.isInteger(value) ? `${value}` : value.toFixed(1);
  }
  return value;
}
