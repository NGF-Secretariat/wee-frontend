import type { DataPageIndicator } from "@/app/lib/data-page-indicator-config";

export interface DataPageMockData {
  gender_disaggregation_sector: Array<{ name: string; female: number; male: number }>;
  survey_social_norms: Array<{ name: string; value: number }>;
  gender_responsive_budgeting_framework: boolean;
}

export const DATA_PAGE_MOCK_DATA: DataPageMockData = {
  gender_disaggregation_sector: [
    { name: "Health", female: 78, male: 82 },
    { name: "Education", female: 74, male: 79 },
    { name: "Agriculture", female: 58, male: 66 },
    { name: "Labour", female: 63, male: 69 },
    { name: "Finance", female: 61, male: 71 },
  ],
  survey_social_norms: [
    { name: "Decision-making", value: 54 },
    { name: "Mobility", value: 61 },
    { name: "Economic autonomy", value: 49 },
    { name: "Leadership attitudes", value: 57 },
  ],
  gender_responsive_budgeting_framework: true,
};

export function getDataPageChartData(indicator: DataPageIndicator, data: DataPageMockData) {
  if (indicator.id === "gender_disaggregation_sector") {
    return data.gender_disaggregation_sector;
  }

  if (indicator.id === "survey_social_norms") {
    return data.survey_social_norms;
  }

  return data.gender_responsive_budgeting_framework;
}

export function getDataPageTakeaway(indicatorId: string): string {
  if (indicatorId === "gender_disaggregation_sector") {
    return "Data disaggregation is strongest in health and education, with weaker coverage in agriculture and finance.";
  }

  if (indicatorId === "survey_social_norms") {
    return "Social norms scores suggest progress in mobility but slower change in economic autonomy attitudes.";
  }

  return "Framework adoption exists, but impact depends on implementation quality and budget compliance monitoring.";
}
