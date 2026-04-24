/**
 * Sociocultural Indicator Metadata
 * Defines all indicators with intelligent chart type assignment
 */

export type IndicatorCategory =
  | "identity"
  | "finance"
  | "assets"
  | "infrastructure"
  | "time_use"
  | "migration";

export type IndicatorType = "female" | "male" | "comparison" | "general";
export type ChartType = "bar" | "groupedBar" | "pie" | "kpi";

export interface SocioculturalIndicator {
  id: string;
  label: string;
  category: IndicatorCategory;
  type: IndicatorType;
  preferredChart: ChartType;
  description: string;
  dataKey: string;
  unit?: string;
  isMaleFemalePair?: boolean; // True if male/female pair exists
  relatedPairId?: string; // ID of the paired indicator
}

export const SOCIOCULTURAL_INDICATORS: SocioculturalIndicator[] = [
  // Identity Category
  {
    id: "nin_female",
    label: "Female NIN Enrollment",
    category: "identity",
    type: "female",
    preferredChart: "groupedBar",
    description: "Female enrollment in National Identification Number (NIN)",
    dataKey: "nin_female",
    unit: "%",
    isMaleFemalePair: true,
    relatedPairId: "nin_male",
  },
  {
    id: "nin_male",
    label: "Male NIN Enrollment",
    category: "identity",
    type: "male",
    preferredChart: "groupedBar",
    description: "Male enrollment in National Identification Number (NIN)",
    dataKey: "nin_male",
    unit: "%",
    isMaleFemalePair: true,
    relatedPairId: "nin_female",
  },

  // Finance & Digital Access Category
  {
    id: "mobile_female",
    label: "Female Mobile Phone Ownership",
    category: "finance",
    type: "female",
    preferredChart: "groupedBar",
    description: "Female mobile phone ownership rates",
    dataKey: "mobile_female",
    unit: "%",
    isMaleFemalePair: true,
    relatedPairId: "mobile_male",
  },
  {
    id: "mobile_male",
    label: "Male Mobile Phone Ownership",
    category: "finance",
    type: "male",
    preferredChart: "groupedBar",
    description: "Male mobile phone ownership rates",
    dataKey: "mobile_male",
    unit: "%",
    isMaleFemalePair: true,
    relatedPairId: "mobile_female",
  },
  {
    id: "smartphone_female",
    label: "Female Smartphone Ownership",
    category: "finance",
    type: "female",
    preferredChart: "groupedBar",
    description: "Female smartphone ownership rates",
    dataKey: "smartphone_female",
    unit: "%",
    isMaleFemalePair: true,
    relatedPairId: "smartphone_male",
  },
  {
    id: "smartphone_male",
    label: "Male Smartphone Ownership",
    category: "finance",
    type: "male",
    preferredChart: "groupedBar",
    description: "Male smartphone ownership rates",
    dataKey: "smartphone_male",
    unit: "%",
    isMaleFemalePair: true,
    relatedPairId: "smartphone_female",
  },

  // Social Protection Category
  {
    id: "cash_transfer_female",
    label: "Female Cash Transfer Recipients",
    category: "finance",
    type: "female",
    preferredChart: "groupedBar",
    description: "Female beneficiaries of cash transfer programs",
    dataKey: "cash_transfer_female",
    unit: "%",
    isMaleFemalePair: true,
    relatedPairId: "cash_transfer_male",
  },
  {
    id: "cash_transfer_male",
    label: "Male Cash Transfer Recipients",
    category: "finance",
    type: "male",
    preferredChart: "groupedBar",
    description: "Male beneficiaries of cash transfer programs",
    dataKey: "cash_transfer_male",
    unit: "%",
    isMaleFemalePair: true,
    relatedPairId: "cash_transfer_female",
  },
  {
    id: "pension_female",
    label: "Female Access to Pension",
    category: "finance",
    type: "female",
    preferredChart: "groupedBar",
    description: "Female access to formal pension schemes",
    dataKey: "pension_female",
    unit: "%",
    isMaleFemalePair: true,
    relatedPairId: "pension_male",
  },
  {
    id: "pension_male",
    label: "Male Access to Pension",
    category: "finance",
    type: "male",
    preferredChart: "groupedBar",
    description: "Male access to formal pension schemes",
    dataKey: "pension_male",
    unit: "%",
    isMaleFemalePair: true,
    relatedPairId: "pension_female",
  },
  {
    id: "micropension_female",
    label: "Female Access to Micropension",
    category: "finance",
    type: "female",
    preferredChart: "groupedBar",
    description: "Female access to informal micropension services",
    dataKey: "micropension_female",
    unit: "%",
    isMaleFemalePair: true,
    relatedPairId: "micropension_male",
  },
  {
    id: "micropension_male",
    label: "Male Access to Micropension",
    category: "finance",
    type: "male",
    preferredChart: "groupedBar",
    description: "Male access to informal micropension services",
    dataKey: "micropension_male",
    unit: "%",
    isMaleFemalePair: true,
    relatedPairId: "micropension_female",
  },

  // Assets Category
  {
    id: "land_ownership_female",
    label: "Female Land Ownership",
    category: "assets",
    type: "female",
    preferredChart: "bar",
    description: "Female ownership and control of land",
    dataKey: "land_ownership_female",
    unit: "%",
  },

  // Time Use Category
  {
    id: "unpaid_work_female",
    label: "Female Time in Unpaid Domestic Work",
    category: "time_use",
    type: "female",
    preferredChart: "groupedBar",
    description: "Average daily hours spent on unpaid domestic work by women",
    dataKey: "unpaid_work_female",
    unit: "hours",
    isMaleFemalePair: true,
    relatedPairId: "unpaid_work_male",
  },
  {
    id: "unpaid_work_male",
    label: "Male Time in Unpaid Domestic Work",
    category: "time_use",
    type: "male",
    preferredChart: "groupedBar",
    description: "Average daily hours spent on unpaid domestic work by men",
    dataKey: "unpaid_work_male",
    unit: "hours",
    isMaleFemalePair: true,
    relatedPairId: "unpaid_work_female",
  },

  // Migration Category
  {
    id: "migration_female",
    label: "Female Migration Abroad",
    category: "migration",
    type: "female",
    preferredChart: "groupedBar",
    description: "Female migration abroad rate",
    dataKey: "migration_female",
    unit: "%",
    isMaleFemalePair: true,
    relatedPairId: "migration_male",
  },
  {
    id: "migration_male",
    label: "Male Migration Abroad",
    category: "migration",
    type: "male",
    preferredChart: "groupedBar",
    description: "Male migration abroad rate",
    dataKey: "migration_male",
    unit: "%",
    isMaleFemalePair: true,
    relatedPairId: "migration_female",
  },

  // Infrastructure Category (General - no gender split)
  {
    id: "childcare_centers_rural",
    label: "Rural Childcare Centers",
    category: "infrastructure",
    type: "general",
    preferredChart: "groupedBar",
    description: "Number of functional childcare centers in rural areas",
    dataKey: "childcare_rural",
    unit: "facilities",
  },
  {
    id: "childcare_centers_urban",
    label: "Urban Childcare Centers",
    category: "infrastructure",
    type: "general",
    preferredChart: "groupedBar",
    description: "Number of functional childcare centers in urban areas",
    dataKey: "childcare_urban",
    unit: "facilities",
  },
  {
    id: "access_potable_water",
    label: "Access to Potable Water",
    category: "infrastructure",
    type: "general",
    preferredChart: "kpi",
    description: "Percentage of population with access to safe drinking water",
    dataKey: "potable_water",
    unit: "%",
  },
  {
    id: "functioning_water_board",
    label: "Functioning Water Boards",
    category: "infrastructure",
    type: "general",
    preferredChart: "bar",
    description: "Number of functional water boards",
    dataKey: "water_boards",
    unit: "boards",
  },
  {
    id: "public_toilets",
    label: "Public Toilet Facilities",
    category: "infrastructure",
    type: "general",
    preferredChart: "bar",
    description: "Number of public toilet facilities",
    dataKey: "public_toilets",
    unit: "facilities",
  },
  {
    id: "school_toilets",
    label: "Toilets in Schools",
    category: "infrastructure",
    type: "general",
    preferredChart: "groupedBar",
    description: "Number of functional toilets in schools by category",
    dataKey: "school_toilets",
    unit: "toilets",
  },
  {
    id: "water_distance",
    label: "Daily Water Collection Distance",
    category: "infrastructure",
    type: "general",
    preferredChart: "kpi",
    description: "Average distance traveled per day to collect water",
    dataKey: "water_distance",
    unit: "km",
  },
  {
    id: "electricity_hours",
    label: "Daily Electricity Availability",
    category: "infrastructure",
    type: "general",
    preferredChart: "kpi",
    description: "Average hours of electricity availability per day",
    dataKey: "electricity_hours",
    unit: "hours",
  },
];

export function getIndicatorById(
  id: string
): SocioculturalIndicator | undefined {
  return SOCIOCULTURAL_INDICATORS.find((ind) => ind.id === id);
}

export function getIndicatorsByCategory(
  category: IndicatorCategory
): SocioculturalIndicator[] {
  return SOCIOCULTURAL_INDICATORS.filter((ind) => ind.category === category);
}

export function getAllCategories(): IndicatorCategory[] {
  const categories = new Set(SOCIOCULTURAL_INDICATORS.map((ind) => ind.category));
  return Array.from(categories) as IndicatorCategory[];
}

export const CATEGORY_LABELS: Record<IndicatorCategory, string> = {
  identity: "Identity & Registration",
  finance: "Finance & Digital Access",
  assets: "Assets & Ownership",
  infrastructure: "Infrastructure & Services",
  time_use: "Time Use",
  migration: "Migration",
};
