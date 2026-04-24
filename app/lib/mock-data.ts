/**
 * Mock Data for Economic Participation Indicators
 * Realistic Nigerian data by state/LGA
 */

export interface StateData {
  state: string;
  [key: string]: any;
}

export interface LGAData {
  lga: string;
  state: string;
  [key: string]: any;
}

/**
 * National-level data
 */
export const NATIONAL_DATA = {
  female_lfpr: 42.5,
  male_lfpr: 68.3,
  labour_gap: 25.8,
  female_ag: 15.2,
  male_ag: 22.1,
  female_business: 12.3,
  male_business: 18.7,
  entrepreneurship_gap: 6.4,
  female_banking: 38.2,
  male_banking: 52.1,
  finance_gap: 13.9,
  female_income: 45000,
  male_income: 62000,
  wage_gap: 27.4,
  female_training: 8.5,
  female_leadership: 22.1,
};

/**
 * State-level data for geographic visualization
 */
export const STATE_DATA: StateData[] = [
  {
    state: "Lagos",
    female_lfpr: 58.2,
    male_lfpr: 72.5,
    labour_gap: 14.3,
    female_ag: 2.1,
    male_ag: 3.5,
    female_business: 22.5,
    male_business: 28.3,
    entrepreneurship_gap: 5.8,
    female_banking: 62.3,
    male_banking: 68.5,
    finance_gap: 6.2,
    female_income: 85000,
    male_income: 105000,
    wage_gap: 19.0,
    female_training: 18.3,
    female_leadership: 35.2,
  },
  {
    state: "Kano",
    female_lfpr: 28.5,
    male_lfpr: 58.2,
    labour_gap: 29.7,
    female_ag: 28.3,
    male_ag: 42.1,
    female_business: 6.2,
    male_business: 12.5,
    entrepreneurship_gap: 6.3,
    female_banking: 18.5,
    male_banking: 35.2,
    finance_gap: 16.7,
    female_income: 32000,
    male_income: 48000,
    wage_gap: 33.3,
    female_training: 3.2,
    female_leadership: 12.5,
  },
  {
    state: "Rivers",
    female_lfpr: 48.3,
    male_lfpr: 65.2,
    labour_gap: 16.9,
    female_ag: 8.2,
    male_ag: 15.3,
    female_business: 14.8,
    male_business: 22.1,
    entrepreneurship_gap: 7.3,
    female_banking: 45.2,
    male_banking: 58.5,
    finance_gap: 13.3,
    female_income: 62000,
    male_income: 82000,
    wage_gap: 24.4,
    female_training: 11.5,
    female_leadership: 28.3,
  },
  {
    state: "Oyo",
    female_lfpr: 45.2,
    male_lfpr: 62.5,
    labour_gap: 17.3,
    female_ag: 18.5,
    male_ag: 28.2,
    female_business: 15.3,
    male_business: 24.1,
    entrepreneurship_gap: 8.8,
    female_banking: 42.1,
    male_banking: 55.3,
    finance_gap: 13.2,
    female_income: 48000,
    male_income: 65000,
    wage_gap: 26.2,
    female_training: 9.8,
    female_leadership: 24.1,
  },
  {
    state: "Kaduna",
    female_lfpr: 35.2,
    male_lfpr: 55.3,
    labour_gap: 20.1,
    female_ag: 32.1,
    male_ag: 45.3,
    female_business: 8.5,
    male_business: 15.2,
    entrepreneurship_gap: 6.7,
    female_banking: 22.5,
    male_banking: 38.2,
    finance_gap: 15.7,
    female_income: 35000,
    male_income: 52000,
    wage_gap: 32.7,
    female_training: 5.3,
    female_leadership: 15.8,
  },
  {
    state: "Delta",
    female_lfpr: 52.1,
    male_lfpr: 68.5,
    labour_gap: 16.4,
    female_ag: 5.2,
    male_ag: 12.3,
    female_business: 18.2,
    male_business: 25.8,
    entrepreneurship_gap: 7.6,
    female_banking: 51.3,
    male_banking: 62.1,
    finance_gap: 10.8,
    female_income: 72000,
    male_income: 92000,
    wage_gap: 21.7,
    female_training: 14.2,
    female_leadership: 31.5,
  },
  {
    state: "Enugu",
    female_lfpr: 44.8,
    male_lfpr: 61.2,
    labour_gap: 16.4,
    female_ag: 15.3,
    male_ag: 24.5,
    female_business: 13.2,
    male_business: 21.5,
    entrepreneurship_gap: 8.3,
    female_banking: 38.5,
    male_banking: 52.3,
    finance_gap: 13.8,
    female_income: 44000,
    male_income: 62000,
    wage_gap: 29.0,
    female_training: 8.2,
    female_leadership: 22.8,
  },
  {
    state: "Imo",
    female_lfpr: 42.5,
    male_lfpr: 58.3,
    labour_gap: 15.8,
    female_ag: 18.2,
    male_ag: 28.1,
    female_business: 12.5,
    male_business: 20.2,
    entrepreneurship_gap: 7.7,
    female_banking: 35.2,
    male_banking: 48.5,
    finance_gap: 13.3,
    female_income: 40000,
    male_income: 58000,
    wage_gap: 31.0,
    female_training: 7.5,
    female_leadership: 20.5,
  },
  {
    state: "Abia",
    female_lfpr: 40.2,
    male_lfpr: 56.5,
    labour_gap: 16.3,
    female_ag: 22.1,
    male_ag: 32.3,
    female_business: 11.2,
    male_business: 18.5,
    entrepreneurship_gap: 7.3,
    female_banking: 32.1,
    male_banking: 45.2,
    finance_gap: 13.1,
    female_income: 38000,
    male_income: 55000,
    wage_gap: 30.9,
    female_training: 6.8,
    female_leadership: 18.2,
  },
  {
    state: "Akwa Ibom",
    female_lfpr: 46.3,
    male_lfpr: 62.1,
    labour_gap: 15.8,
    female_ag: 12.5,
    male_ag: 22.3,
    female_business: 14.8,
    male_business: 22.5,
    entrepreneurship_gap: 7.7,
    female_banking: 41.3,
    male_banking: 54.2,
    finance_gap: 12.9,
    female_income: 50000,
    male_income: 68000,
    wage_gap: 26.5,
    female_training: 10.2,
    female_leadership: 25.3,
  },
  {
    state: "Bauchi",
    female_lfpr: 25.3,
    male_lfpr: 52.1,
    labour_gap: 26.8,
    female_ag: 38.2,
    male_ag: 51.2,
    female_business: 4.2,
    male_business: 9.8,
    entrepreneurship_gap: 5.6,
    female_banking: 12.3,
    male_banking: 28.5,
    finance_gap: 16.2,
    female_income: 28000,
    male_income: 42000,
    wage_gap: 33.3,
    female_training: 2.1,
    female_leadership: 8.5,
  },
  {
    state: "Benue",
    female_lfpr: 41.2,
    male_lfpr: 58.5,
    labour_gap: 17.3,
    female_ag: 28.5,
    male_ag: 38.2,
    female_business: 9.8,
    male_business: 16.5,
    entrepreneurship_gap: 6.7,
    female_banking: 28.2,
    male_banking: 42.1,
    finance_gap: 13.9,
    female_income: 32000,
    male_income: 48000,
    wage_gap: 33.3,
    female_training: 5.2,
    female_leadership: 14.5,
  },
];

/**
 * Sample LGA data (Expanded)
 */
export const LGA_DATA: LGAData[] = [
  // Lagos LGAs
  { lga: "Ikeja", state: "Lagos", female_lfpr: 65.2, male_lfpr: 75.3 },
  { lga: "Ikorodu", state: "Lagos", female_lfpr: 52.1, male_lfpr: 68.5 },
  { lga: "Badagry", state: "Lagos", female_lfpr: 48.3, male_lfpr: 62.1 },
  { lga: "Epe", state: "Lagos", female_lfpr: 45.2, male_lfpr: 58.3 },
  { lga: "Lagos Island", state: "Lagos", female_lfpr: 62.5, male_lfpr: 72.8 },

  // Kano LGAs
  { lga: "Kano Municipal", state: "Kano", female_lfpr: 32.1, male_lfpr: 61.2 },
  { lga: "Tarauni", state: "Kano", female_lfpr: 25.3, male_lfpr: 55.2 },
  { lga: "Gwale", state: "Kano", female_lfpr: 28.5, male_lfpr: 58.3 },
  { lga: "Nassarawa", state: "Kano", female_lfpr: 26.2, male_lfpr: 56.1 },

  // Rivers LGAs
  { lga: "Port Harcourt", state: "Rivers", female_lfpr: 55.3, male_lfpr: 68.2 },
  { lga: "Obio-Akpor", state: "Rivers", female_lfpr: 48.2, male_lfpr: 64.1 },
  { lga: "Tai", state: "Rivers", female_lfpr: 35.2, male_lfpr: 52.3 },
];

/**
 * Sample employment distribution by sector
 */
export const EMPLOYMENT_SECTOR_DISTRIBUTION = {
  female_sector_dist: [
    { name: "Agriculture", value: 28, color: "#22c55e" },
    { name: "Trade & Commerce", value: 24, color: "#3b82f6" },
    { name: "Services", value: 22, color: "#f59e0b" },
    { name: "Manufacturing", value: 12, color: "#8b5cf6" },
    { name: "Other", value: 14, color: "#6b7280" },
  ],
  male_sector_dist: [
    { name: "Agriculture", value: 32, color: "#22c55e" },
    { name: "Construction", value: 20, color: "#10b981" },
    { name: "Trade & Commerce", value: 18, color: "#3b82f6" },
    { name: "Manufacturing", value: 16, color: "#8b5cf6" },
    { name: "Other", value: 14, color: "#6b7280" },
  ],
};

/**
 * Sample gender comparison data
 */
export const GENDER_COMPARISON_DATA = [
  { indicator: "Labour Force", female: 42.5, male: 68.3 },
  { indicator: "Agricultural Employment", female: 15.2, male: 22.1 },
  { indicator: "Business Ownership", female: 12.3, male: 18.7 },
  { indicator: "Bank Account Access", female: 38.2, male: 52.1 },
  { indicator: "Vocational Training", female: 8.5, male: 14.2 },
  { indicator: "Leadership Roles", female: 22.1, male: 35.8 },
];

/**
 * Get state data for visualization
 */
export function getStateData(): StateData[] {
  return STATE_DATA;
}

/**
 * Get LGA data for a specific state
 */
export function getLGADataByState(state: string): LGAData[] {
  return LGA_DATA.filter((lga) => lga.state === state);
}

/**
 * Get single state data
 */
export function getStateById(state: string): StateData | undefined {
  return STATE_DATA.find((s) => s.state === state);
}

/**
 * Transform state data to GeoJSON-compatible format for choropleth
 */
export function transformToGeoJSONData(
  data: StateData[],
  dataKey: string
): Record<string, number> {
  const result: Record<string, number> = {};
  data.forEach((state) => {
    result[state.state] = state[dataKey] || 0;
  });
  return result;
}

/**
 * Get time-series data (for future use)
 */
export const TIME_SERIES_DATA = [
  { year: 2018, female_lfpr: 38.2, male_lfpr: 64.3 },
  { year: 2019, female_lfpr: 39.5, male_lfpr: 65.1 },
  { year: 2020, female_lfpr: 40.1, male_lfpr: 65.8 },
  { year: 2021, female_lfpr: 41.3, male_lfpr: 66.5 },
  { year: 2022, female_lfpr: 42.5, male_lfpr: 68.3 },
];
