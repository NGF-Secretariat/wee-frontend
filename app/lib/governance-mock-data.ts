import type { GovernanceIndicator } from "@/app/lib/governance-indicator-config";

export interface GovernancePairDataset {
  byZone: Array<{ name: string; female: number; male: number }>;
  femaleNational: number;
  maleNational: number;
}

export interface GovernanceMockData {
  perception_democracy: GovernancePairDataset;
  voter_turnout: GovernancePairDataset;
  public_opinion_women: Array<{ name: string; value: number }>;
  party_membership: Array<{ name: string; value: number }>;
  women_party_leadership: Array<{ name: string; value: number }>;
  women_parliament: Array<{ name: string; value: number }>;
  women_commissioners: Array<{ name: string; value: number }>;
  women_lga_chair: Array<{ name: string; value: number }>;
  women_civil_service: Array<{ name: string; value: number }>;
  gender_quota_policy: boolean;
  gender_quota_coverage: Array<{ name: string; value: number }>;
}

export const GOVERNANCE_MOCK_DATA: GovernanceMockData = {
  perception_democracy: {
    byZone: [
      { name: "North West", female: 42, male: 54 },
      { name: "North East", female: 39, male: 49 },
      { name: "North Central", female: 46, male: 57 },
      { name: "South West", female: 58, male: 66 },
      { name: "South East", female: 55, male: 63 },
      { name: "South South", female: 53, male: 62 },
    ],
    femaleNational: 49,
    maleNational: 59,
  },
  voter_turnout: {
    byZone: [
      { name: "North West", female: 44, male: 58 },
      { name: "North East", female: 40, male: 53 },
      { name: "North Central", female: 48, male: 61 },
      { name: "South West", female: 57, male: 69 },
      { name: "South East", female: 54, male: 66 },
      { name: "South South", female: 52, male: 64 },
    ],
    femaleNational: 49,
    maleNational: 62,
  },
  public_opinion_women: [
    { name: "Support", value: 64 },
    { name: "Neutral", value: 20 },
    { name: "Oppose", value: 16 },
  ],
  party_membership: [
    { name: "Lagos", value: 420000 },
    { name: "Kano", value: 350000 },
    { name: "Rivers", value: 210000 },
    { name: "Oyo", value: 230000 },
    { name: "Kaduna", value: 195000 },
    { name: "Enugu", value: 165000 },
  ],
  women_party_leadership: [
    { name: "Lagos", value: 36 },
    { name: "Kano", value: 18 },
    { name: "Rivers", value: 28 },
    { name: "Oyo", value: 26 },
    { name: "Kaduna", value: 19 },
    { name: "Enugu", value: 24 },
  ],
  women_parliament: [
    { name: "Lagos", value: 18 },
    { name: "Kano", value: 8 },
    { name: "Rivers", value: 14 },
    { name: "Oyo", value: 12 },
    { name: "Kaduna", value: 9 },
    { name: "Enugu", value: 15 },
  ],
  women_commissioners: [
    { name: "Lagos", value: 6 },
    { name: "Kano", value: 3 },
    { name: "Rivers", value: 5 },
    { name: "Oyo", value: 4 },
    { name: "Kaduna", value: 3 },
    { name: "Enugu", value: 5 },
  ],
  women_lga_chair: [
    { name: "Lagos", value: 4 },
    { name: "Kano", value: 1 },
    { name: "Rivers", value: 2 },
    { name: "Oyo", value: 2 },
    { name: "Kaduna", value: 1 },
    { name: "Enugu", value: 2 },
  ],
  women_civil_service: [
    { name: "Lagos", value: 34 },
    { name: "Kano", value: 21 },
    { name: "Rivers", value: 30 },
    { name: "Oyo", value: 28 },
    { name: "Kaduna", value: 22 },
    { name: "Enugu", value: 31 },
  ],
  gender_quota_policy: true,
  gender_quota_coverage: [
    { name: "Party primaries", value: 52 },
    { name: "Candidate lists", value: 47 },
    { name: "Appointments", value: 61 },
    { name: "Cabinet positions", value: 56 },
  ],
};

export function getGovernanceChartData(indicator: GovernanceIndicator, data: GovernanceMockData) {
  switch (indicator.id) {
    case "perception_democracy_female":
    case "perception_democracy_male":
      return data.perception_democracy.byZone;

    case "voter_turnout_female":
    case "voter_turnout_male":
      return data.voter_turnout.byZone;

    case "public_opinion_women":
      return data.public_opinion_women;

    case "party_membership":
      return data.party_membership;

    case "women_party_leadership":
      return data.women_party_leadership;

    case "women_parliament":
      return data.women_parliament;

    case "women_commissioners":
      return data.women_commissioners;

    case "women_lga_chair":
      return data.women_lga_chair;

    case "women_civil_service":
      return data.women_civil_service;

    case "gender_quota_policy":
      return data.gender_quota_policy;

    case "gender_quota_coverage":
      return data.gender_quota_coverage;

    default:
      return [];
  }
}

export function getGovernanceTakeaway(indicatorId: string): string {
  switch (indicatorId) {
    case "voter_turnout_female":
    case "voter_turnout_male":
      return "Male turnout still exceeds female turnout across all zones, with the widest gaps in northern zones.";
    case "public_opinion_women":
      return "Public support for women in politics is strong, but translation into representation remains slower.";
    case "women_parliament":
      return "Women remain underrepresented in state parliaments, indicating ongoing candidate pipeline constraints.";
    case "gender_quota_policy":
      return "Quota policy existence is a positive step, but implementation and enforcement determine impact.";
    default:
      return "This indicator highlights progress and remaining gaps in inclusive political participation.";
  }
}
