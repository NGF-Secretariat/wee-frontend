/**
 * Data transformation utilities for different visualization types
 */

import { IndicatorMetadata } from "@/app/lib/indicator-config";
import { StateData } from "@/app/lib/mock-data";

/**
 * Transform state data array for bar chart display
 */
export function transformForBarChart(
  data: StateData[],
  indicator: IndicatorMetadata
) {
  return data
    .map((state) => ({
      state: state.state,
      value: state[indicator.dataKey || indicator.id] || 0,
      [indicator.dataKey || indicator.id]: state[indicator.dataKey || indicator.id] || 0,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Transform data for gender comparison bar chart
 */
export function transformForGenderComparison(data: StateData[], femaleKey: string, maleKey: string) {
  return data
    .map((state) => ({
      state: state.state,
      female: state[femaleKey] || 0,
      male: state[maleKey] || 0,
    }))
    .sort((a, b) => b.female + b.male - (a.female + a.male));
}

/**
 * Transform data for pie chart (distribution)
 */
export function transformForPieChart(data: any[]) {
  if (Array.isArray(data) && data.length > 0) {
    // If already in correct format with 'name' and 'value'
    if (data[0].name && typeof data[0].value === "number") {
      return data;
    }
  }
  return data;
}

/**
 * Calculate national average from state data
 */
export function calculateNationalAverage(
  data: StateData[],
  dataKey: string
): number {
  const values = data
    .map((state) => state[dataKey])
    .filter((val) => val !== undefined && val !== null);

  if (values.length === 0) return 0;

  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

/**
 * Get top performers for a metric
 */
export function getTopPerformers(
  data: StateData[],
  dataKey: string,
  limit = 5
): StateData[] {
  return data
    .filter((state) => state[dataKey] !== undefined)
    .sort((a, b) => (b[dataKey] || 0) - (a[dataKey] || 0))
    .slice(0, limit);
}

/**
 * Get bottom performers for a metric
 */
export function getBottomPerformers(
  data: StateData[],
  dataKey: string,
  limit = 5
): StateData[] {
  return data
    .filter((state) => state[dataKey] !== undefined)
    .sort((a, b) => (a[dataKey] || 0) - (b[dataKey] || 0))
    .slice(0, limit);
}

/**
 * Calculate gender gap
 */
export function calculateGenderGap(female: number, male: number): number {
  return Math.round((male - female) * 10) / 10;
}

/**
 * Get data insights for an indicator
 */
export interface DataInsight {
  title: string;
  value: string | number;
  description: string;
  type: "stat" | "ranking" | "gap";
}

export function generateInsights(
  data: StateData[],
  indicator: IndicatorMetadata
): DataInsight[] {
  const dataKey = indicator.dataKey || indicator.id;
  const insights: DataInsight[] = [];

  // National average
  const national = calculateNationalAverage(data, dataKey);
  insights.push({
    title: "National Average",
    value: `${national}${indicator.unit === "%" ? "%" : ""}`,
    description: `Average across all states`,
    type: "stat",
  });

  // Top performer
  const top = getTopPerformers(data, dataKey, 1)[0];
  if (top) {
    insights.push({
      title: "Best Performing State",
      value: top.state,
      description: `${top[dataKey]}${indicator.unit === "%" ? "%" : ""}`,
      type: "ranking",
    });
  }

  // Bottom performer
  const bottom = getBottomPerformers(data, dataKey, 1)[0];
  if (bottom) {
    insights.push({
      title: "Lowest Performing State",
      value: bottom.state,
      description: `${bottom[dataKey]}${indicator.unit === "%" ? "%" : ""}`,
      type: "ranking",
    });
  }

  return insights;
}

/**
 * Format number for display
 */
export function formatValue(value: any, unit?: string): string {
  if (value === undefined || value === null) return "N/A";

  if (unit === "₦") {
    return `₦${Number(value).toLocaleString()}`;
  }
  if (unit === "%") {
    return `${value}%`;
  }

  return value.toString();
}

/**
 * Get chart data based on indicator type
 */
export function getChartData(
  data: StateData[],
  indicator: IndicatorMetadata
): any {
  switch (indicator.preferredChart) {
    case "bar":
      return transformForBarChart(data, indicator);

    case "pie":
      // For pie charts, data should already be in the correct format
      // This is placeholder logic
      return data;

    case "line":
      // For line charts, return time-series data
      return data;

    case "map":
      // For maps, return state data
      return data;

    case "kpi":
      // For KPI, return single value (national average)
      return calculateNationalAverage(data, indicator.dataKey || indicator.id);

    default:
      return data;
  }
}
