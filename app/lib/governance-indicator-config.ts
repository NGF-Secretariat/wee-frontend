/**
 * Governance & Political Participation Indicator Metadata
 * Defines all indicators with intelligent chart type assignment
 */

export type GovernanceCategory =
  | "participation"
  | "representation"
  | "policy"
  | "perception";

export type GovernanceType = "female" | "male" | "comparison" | "general";
export type GovernanceChartType = "groupedBar" | "bar" | "pie" | "kpi";

export interface GovernanceIndicator {
  id: string;
  label: string;
  category: GovernanceCategory;
  type: GovernanceType;
  preferredChart: GovernanceChartType;
  description: string;
  dataKey: string;
  unit: "%" | "count" | "boolean";
  isMaleFemalePair?: boolean;
  relatedPairId?: string;
}

export const GOVERNANCE_INDICATORS: GovernanceIndicator[] = [
  // Perception Category
  {
    id: "perception_democracy_female",
    label: "Female Perception of Democratic Process",
    category: "perception",
    type: "female",
    preferredChart: "groupedBar",
    description:
      "Percentage of women with positive perception about the democratic process",
    dataKey: "perception_democracy_female",
    unit: "%",
    isMaleFemalePair: true,
    relatedPairId: "perception_democracy_male",
  },
  {
    id: "perception_democracy_male",
    label: "Male Perception of Democratic Process",
    category: "perception",
    type: "male",
    preferredChart: "groupedBar",
    description:
      "Percentage of men with positive perception about the democratic process",
    dataKey: "perception_democracy_male",
    unit: "%",
    isMaleFemalePair: true,
    relatedPairId: "perception_democracy_female",
  },
  {
    id: "public_opinion_women",
    label: "Public Opinion on Women in Politics",
    category: "perception",
    type: "general",
    preferredChart: "pie",
    description: "Public support for increased women participation in politics",
    dataKey: "public_opinion_women",
    unit: "%",
  },

  // Participation Category
  {
    id: "voter_turnout_female",
    label: "Female Voter Turnout",
    category: "participation",
    type: "female",
    preferredChart: "groupedBar",
    description: "Percentage of eligible women who voted in recent elections",
    dataKey: "voter_turnout_female",
    unit: "%",
    isMaleFemalePair: true,
    relatedPairId: "voter_turnout_male",
  },
  {
    id: "voter_turnout_male",
    label: "Male Voter Turnout",
    category: "participation",
    type: "male",
    preferredChart: "groupedBar",
    description: "Percentage of eligible men who voted in recent elections",
    dataKey: "voter_turnout_male",
    unit: "%",
    isMaleFemalePair: true,
    relatedPairId: "voter_turnout_female",
  },
  {
    id: "party_membership",
    label: "Membership in Political Parties",
    category: "participation",
    type: "general",
    preferredChart: "bar",
    description: "Number of registered members in political parties by state",
    dataKey: "party_membership",
    unit: "count",
  },
  {
    id: "women_party_leadership",
    label: "Women in Party Leadership Positions",
    category: "participation",
    type: "female",
    preferredChart: "bar",
    description: "Number of women holding leadership positions in political parties",
    dataKey: "women_party_leadership",
    unit: "count",
  },

  // Representation Category
  {
    id: "women_parliament",
    label: "Women in State Parliaments",
    category: "representation",
    type: "general",
    preferredChart: "bar",
    description:
      "Percentage of women representatives in state parliaments/assemblies",
    dataKey: "women_parliament",
    unit: "%",
  },
  {
    id: "women_commissioners",
    label: "Women Commissioners",
    category: "representation",
    type: "general",
    preferredChart: "bar",
    description: "Number of women appointed as state commissioners",
    dataKey: "women_commissioners",
    unit: "count",
  },
  {
    id: "women_lga_chair",
    label: "Women Local Government Chairs",
    category: "representation",
    type: "general",
    preferredChart: "bar",
    description: "Number of women serving as Local Government Area (LGA) chairs",
    dataKey: "women_lga_chair",
    unit: "count",
  },
  {
    id: "women_civil_service",
    label: "Women in Senior Civil Service",
    category: "representation",
    type: "general",
    preferredChart: "bar",
    description:
      "Percentage of women in senior positions within the civil service",
    dataKey: "women_civil_service",
    unit: "%",
  },

  // Policy Category
  {
    id: "gender_quota_policy",
    label: "Gender Quota Policy Existence",
    category: "policy",
    type: "general",
    preferredChart: "kpi",
    description:
      "Whether the state has a formal gender quota policy in place",
    dataKey: "gender_quota_policy",
    unit: "boolean",
  },
  {
    id: "gender_quota_coverage",
    label: "Gender Quota Coverage Rate",
    category: "policy",
    type: "general",
    preferredChart: "bar",
    description:
      "Percentage coverage of gender quotas across elections and positions",
    dataKey: "gender_quota_coverage",
    unit: "%",
  },
];

export function getGovernanceIndicatorById(
  id: string
): GovernanceIndicator | undefined {
  return GOVERNANCE_INDICATORS.find((ind) => ind.id === id);
}

export function getGovernanceIndicatorsByCategory(
  category: GovernanceCategory
): GovernanceIndicator[] {
  return GOVERNANCE_INDICATORS.filter((ind) => ind.category === category);
}

export function getAllGovernanceCategories(): GovernanceCategory[] {
  const categories = new Set(
    GOVERNANCE_INDICATORS.map((ind) => ind.category)
  );
  return Array.from(categories) as GovernanceCategory[];
}

export const GOVERNANCE_CATEGORY_LABELS: Record<GovernanceCategory, string> = {
  participation: "Political Participation",
  representation: "Representation",
  policy: "Policy & Quotas",
  perception: "Public Perception",
};
