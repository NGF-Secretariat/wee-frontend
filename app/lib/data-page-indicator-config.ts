export type DataPageIndicatorCategory = "data_systems" | "social_norms" | "planning";
export type DataPageChart = "groupedBar" | "bar" | "pie" | "kpi";

export interface DataPageIndicator {
  id: string;
  label: string;
  category: DataPageIndicatorCategory;
  preferredChart: DataPageChart;
  unit: "%" | "score" | "boolean";
  description: string;
}

export const DATA_PAGE_CATEGORY_LABELS: Record<DataPageIndicatorCategory, string> = {
  data_systems: "Data Systems",
  social_norms: "Social Norms",
  planning: "Planning & Budgeting",
};

export const DATA_PAGE_INDICATORS: DataPageIndicator[] = [
  {
    id: "gender_disaggregation_sector",
    label: "Gender disaggregation of data, by sector",
    category: "data_systems",
    preferredChart: "groupedBar",
    unit: "%",
    description: "Share of sector datasets that are properly disaggregated by gender.",
  },
  {
    id: "survey_social_norms",
    label: "Survey on Social Norms",
    category: "social_norms",
    preferredChart: "bar",
    unit: "score",
    description: "Composite social-norms survey score across key dimensions.",
  },
  {
    id: "gender_responsive_budgeting_framework",
    label: "Gender responsive budgeting and planning framework",
    category: "planning",
    preferredChart: "kpi",
    unit: "boolean",
    description: "Whether a formal gender-responsive budgeting and planning framework is in place.",
  },
];

export function getDataPageIndicatorById(id: string): DataPageIndicator | undefined {
  return DATA_PAGE_INDICATORS.find((item) => item.id === id);
}
