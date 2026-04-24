export type HealthIndicatorCategory = "health" | "violence" | "demographics";

export type HealthIndicatorType = "female" | "male" | "comparison" | "general";

export type HealthPreferredChart = "groupedBar" | "bar" | "pie" | "kpi";

export type HealthUnit = "%" | "years" | "count" | "rate";

export interface HealthIndicator {
  id: string;
  label: string;
  category: HealthIndicatorCategory;
  type: HealthIndicatorType;
  preferredChart: HealthPreferredChart;
  unit: HealthUnit;
  description: string;
  dataKey: string;
  pairKey?: string;
  sensitive?: boolean;
}

export const HEALTH_CATEGORY_LABELS: Record<HealthIndicatorCategory, string> = {
  health: "Health",
  violence: "Violence",
  demographics: "Demographics",
};

export const HEALTH_INDICATORS: HealthIndicator[] = [
  {
    id: "health_insurance_female",
    label: "Enrolment in health insurance schemes - female",
    category: "health",
    type: "female",
    preferredChart: "groupedBar",
    unit: "%",
    description: "Female vs male enrolment in health insurance schemes across zones.",
    dataKey: "female",
    pairKey: "insurance_enrolment",
  },
  {
    id: "health_insurance_male",
    label: "Enrolment in health insurance schemes - male",
    category: "health",
    type: "male",
    preferredChart: "groupedBar",
    unit: "%",
    description: "Female vs male enrolment in health insurance schemes across zones.",
    dataKey: "male",
    pairKey: "insurance_enrolment",
  },
  {
    id: "violence_against_women_girls",
    label: "Proportion of Women and Girls Subjected to Violence",
    category: "violence",
    type: "comparison",
    preferredChart: "kpi",
    unit: "%",
    description: "Share of women and girls reporting physical, emotional, or sexual violence.",
    dataKey: "violence_rate",
    sensitive: true,
  },
  {
    id: "incidence_sexual_violence",
    label: "Incidence of Sexual Violence",
    category: "violence",
    type: "comparison",
    preferredChart: "bar",
    unit: "%",
    description: "Incidence of sexual violence by age segment to support targeted response.",
    dataKey: "sexual_violence_by_age",
    sensitive: true,
  },
  {
    id: "reproductive_health_access",
    label: "Access to reproductive health services",
    category: "health",
    type: "general",
    preferredChart: "bar",
    unit: "%",
    description: "Coverage of reproductive health services across service channels.",
    dataKey: "reproductive_health_access",
  },
  {
    id: "maternal_mortality_rate",
    label: "Maternal mortality rate",
    category: "health",
    type: "general",
    preferredChart: "kpi",
    unit: "rate",
    description: "Maternal deaths per 100,000 live births.",
    dataKey: "maternal_mortality",
    sensitive: true,
  },
  {
    id: "life_expectancy_female",
    label: "Life expectancy - female",
    category: "health",
    type: "female",
    preferredChart: "groupedBar",
    unit: "years",
    description: "Female vs male life expectancy across zones.",
    dataKey: "female",
    pairKey: "life_expectancy",
  },
  {
    id: "life_expectancy_male",
    label: "Life expectancy - male",
    category: "health",
    type: "male",
    preferredChart: "groupedBar",
    unit: "years",
    description: "Female vs male life expectancy across zones.",
    dataKey: "male",
    pairKey: "life_expectancy",
  },
  {
    id: "age_first_marriage",
    label: "Age at first marriage",
    category: "demographics",
    type: "general",
    preferredChart: "kpi",
    unit: "years",
    description: "Median age at first marriage for women.",
    dataKey: "age_first_marriage",
  },
  {
    id: "parity_children",
    label: "Parity (Number of children)",
    category: "demographics",
    type: "general",
    preferredChart: "bar",
    unit: "count",
    description: "Average number of children by household profile.",
    dataKey: "parity",
  },
  {
    id: "women_polygamy",
    label: "Women in polygamy",
    category: "demographics",
    type: "general",
    preferredChart: "pie",
    unit: "%",
    description: "Distribution of women in polygamous and non-polygamous unions.",
    dataKey: "polygamy",
  },
];

export function getHealthIndicators(): HealthIndicator[] {
  return HEALTH_INDICATORS;
}

export function getHealthIndicatorById(id: string): HealthIndicator | undefined {
  return HEALTH_INDICATORS.find((indicator) => indicator.id === id);
}
