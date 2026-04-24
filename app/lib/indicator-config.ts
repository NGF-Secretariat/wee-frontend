/**
 * Economic Participation Indicator Metadata
 * Defines visualization preferences and metadata for each indicator
 */

export type IndicatorCategory = "labour" | "agriculture" | "entrepreneurship" | "finance";
export type IndicatorType = "female" | "male" | "gap" | "mixed";
export type PreferredChart = "map" | "bar" | "pie" | "kpi" | "line";
export type ChartVariant = "geographic" | "comparison" | "distribution" | "timeseries" | "single";

export interface IndicatorMetadata {
  id: string;
  label: string;
  category: IndicatorCategory;
  type: IndicatorType;
  preferredChart: PreferredChart;
  description: string;
  unit?: string;
  source?: string;
  helpText?: string;
  dataKey?: string; // For accessing data in the dataset
}

/**
 * Comprehensive indicator definitions for Economic Participation
 */
export const ECONOMIC_PARTICIPATION_INDICATORS: Record<
  string,
  IndicatorMetadata
> = {
  // LABOUR FORCE PARTICIPATION
  female_labour_force_participation: {
    id: "female_labour_force_participation",
    label: "Female Labour Force Participation Rate",
    category: "labour",
    type: "female",
    preferredChart: "map",
    description: "Percentage of females in the labour force by state/LGA",
    unit: "%",
    source: "National Bureau of Statistics",
    helpText: "Shows geographic variation in female labour market engagement",
    dataKey: "female_lfpr",
  },
  male_labour_force_participation: {
    id: "male_labour_force_participation",
    label: "Male Labour Force Participation Rate",
    category: "labour",
    type: "male",
    preferredChart: "map",
    description: "Percentage of males in the labour force by state/LGA",
    unit: "%",
    source: "National Bureau of Statistics",
    helpText: "Shows geographic variation in male labour market engagement",
    dataKey: "male_lfpr",
  },
  gender_gap_labour_participation: {
    id: "gender_gap_labour_participation",
    label: "Gender Gap in Labour Participation",
    category: "labour",
    type: "gap",
    preferredChart: "bar",
    description: "Difference between male and female labour force participation",
    unit: "percentage points",
    source: "National Bureau of Statistics",
    helpText: "Positive values indicate higher male participation",
    dataKey: "labour_gap",
  },

  // AGRICULTURE
  female_agricultural_participation: {
    id: "female_agricultural_participation",
    label: "Female Agricultural Employment",
    category: "agriculture",
    type: "female",
    preferredChart: "map",
    description: "Percentage of employed females in agriculture sector",
    unit: "%",
    source: "National Bureau of Statistics",
    helpText: "Agricultural sector participation by gender and region",
    dataKey: "female_ag",
  },
  male_agricultural_participation: {
    id: "male_agricultural_participation",
    label: "Male Agricultural Employment",
    category: "agriculture",
    type: "male",
    preferredChart: "map",
    description: "Percentage of employed males in agriculture sector",
    unit: "%",
    source: "National Bureau of Statistics",
    helpText: "Agricultural sector participation by gender and region",
    dataKey: "male_ag",
  },

  // ENTREPRENEURSHIP & BUSINESS OWNERSHIP
  female_business_ownership: {
    id: "female_business_ownership",
    label: "Female Business Ownership Rate",
    category: "entrepreneurship",
    type: "female",
    preferredChart: "bar",
    description: "Percentage of females who own or operate a business",
    unit: "%",
    source: "National Bureau of Statistics",
    helpText: "Business ownership and entrepreneurship engagement",
    dataKey: "female_business",
  },
  male_business_ownership: {
    id: "male_business_ownership",
    label: "Male Business Ownership Rate",
    category: "entrepreneurship",
    type: "male",
    preferredChart: "bar",
    description: "Percentage of males who own or operate a business",
    unit: "%",
    source: "National Bureau of Statistics",
    helpText: "Business ownership and entrepreneurship engagement",
    dataKey: "male_business",
  },
  gender_gap_entrepreneurship: {
    id: "gender_gap_entrepreneurship",
    label: "Gender Gap in Entrepreneurship",
    category: "entrepreneurship",
    type: "gap",
    preferredChart: "kpi",
    description: "Difference in business ownership rates between genders",
    unit: "percentage points",
    source: "National Bureau of Statistics",
    helpText: "Shows barriers to female entrepreneurship",
    dataKey: "entrepreneurship_gap",
  },

  // FINANCIAL INCLUSION
  female_bank_account_access: {
    id: "female_bank_account_access",
    label: "Female Bank Account Access",
    category: "finance",
    type: "female",
    preferredChart: "pie",
    description: "Percentage of females with access to bank accounts",
    unit: "%",
    source: "Central Bank of Nigeria / Financial Inclusion Survey",
    helpText: "Financial inclusion and formal banking engagement",
    dataKey: "female_banking",
  },
  male_bank_account_access: {
    id: "male_bank_account_access",
    label: "Male Bank Account Access",
    category: "finance",
    type: "male",
    preferredChart: "pie",
    description: "Percentage of males with access to bank accounts",
    unit: "%",
    source: "Central Bank of Nigeria / Financial Inclusion Survey",
    helpText: "Financial inclusion and formal banking engagement",
    dataKey: "male_banking",
  },
  gender_gap_financial_inclusion: {
    id: "gender_gap_financial_inclusion",
    label: "Gender Gap in Financial Inclusion",
    category: "finance",
    type: "gap",
    preferredChart: "kpi",
    description: "Difference in bank account access between genders",
    unit: "percentage points",
    source: "Central Bank of Nigeria",
    helpText: "Shows female barriers to formal financial services",
    dataKey: "finance_gap",
  },

  // EMPLOYMENT BY SECTOR
  female_employment_distribution: {
    id: "female_employment_distribution",
    label: "Female Employment by Sector",
    category: "labour",
    type: "female",
    preferredChart: "pie",
    description: "Distribution of female employment across sectors",
    unit: "%",
    source: "National Bureau of Statistics",
    helpText: "Shows sector concentration and economic opportunities",
    dataKey: "female_sector_dist",
  },
  male_employment_distribution: {
    id: "male_employment_distribution",
    label: "Male Employment by Sector",
    category: "labour",
    type: "male",
    preferredChart: "pie",
    description: "Distribution of male employment across sectors",
    unit: "%",
    source: "National Bureau of Statistics",
    helpText: "Shows sector concentration and economic opportunities",
    dataKey: "male_sector_dist",
  },

  // INCOME & WAGES
  female_average_income: {
    id: "female_average_income",
    label: "Female Average Monthly Income",
    category: "labour",
    type: "female",
    preferredChart: "map",
    description: "Average monthly income of employed females",
    unit: "₦",
    source: "National Bureau of Statistics",
    helpText: "Income inequality by region and gender",
    dataKey: "female_income",
  },
  male_average_income: {
    id: "male_average_income",
    label: "Male Average Monthly Income",
    category: "labour",
    type: "male",
    preferredChart: "map",
    description: "Average monthly income of employed males",
    unit: "₦",
    source: "National Bureau of Statistics",
    helpText: "Income inequality by region and gender",
    dataKey: "male_income",
  },
  gender_wage_gap: {
    id: "gender_wage_gap",
    label: "Gender Wage Gap",
    category: "labour",
    type: "gap",
    preferredChart: "bar",
    description: "Percentage difference in average income between genders",
    unit: "%",
    source: "National Bureau of Statistics",
    helpText: "Shows income inequality between males and females",
    dataKey: "wage_gap",
  },

  // EDUCATION & SKILLS
  female_vocational_training: {
    id: "female_vocational_training",
    label: "Female Access to Vocational Training",
    category: "labour",
    type: "female",
    preferredChart: "map",
    description: "Percentage of females with access to vocational training",
    unit: "%",
    source: "Ministry of Education",
    helpText: "Capacity building and skill development opportunities",
    dataKey: "female_training",
  },

  // DECISION-MAKING
  female_decision_making_roles: {
    id: "female_decision_making_roles",
    label: "Female in Decision-Making Roles",
    category: "entrepreneurship",
    type: "female",
    preferredChart: "bar",
    description: "Percentage of females in managerial/decision-making positions",
    unit: "%",
    source: "National Bureau of Statistics",
    helpText: "Leadership and management representation",
    dataKey: "female_leadership",
  },
};

/**
 * Get all indicators by category
 */
export function getIndicatorsByCategory(
  category: IndicatorCategory
): IndicatorMetadata[] {
  return Object.values(ECONOMIC_PARTICIPATION_INDICATORS).filter(
    (ind) => ind.category === category
  );
}

/**
 * Get all indicators
 */
export function getAllIndicators(): IndicatorMetadata[] {
  return Object.values(ECONOMIC_PARTICIPATION_INDICATORS);
}

/**
 * Get indicator by ID
 */
export function getIndicatorById(id: string): IndicatorMetadata | undefined {
  return ECONOMIC_PARTICIPATION_INDICATORS[id];
}

/**
 * Categorize indicators for grouping in UI
 */
export const INDICATOR_CATEGORIES: Record<IndicatorCategory, string> = {
  labour: "Labour Force & Employment",
  agriculture: "Agriculture",
  entrepreneurship: "Entrepreneurship & Business",
  finance: "Financial Inclusion",
};
