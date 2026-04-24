import type { GovernanceStructuredData } from "@/app/components/legal/GovernanceCharts";

export const LEGAL_GOVERNANCE_MOCK_DATA: GovernanceStructuredData = {
  policyIndicators: [
    {
      id: "statutory_rights_occupancy_women",
      label: "Statutory Rights of Occupancy for Women",
      value: true,
      description: "Formal legal backing for women to hold statutory rights of occupancy.",
    },
    {
      id: "wee_policy_domestication",
      label: "Domestication of the WEE Policy",
      value: true,
      description: "Whether WEE policy provisions are adopted into state policy instruments.",
    },
    {
      id: "child_right_act_adoption",
      label: "Adoption of the Child Right Act",
      value: false,
      description: "State-level legal adoption status for child protection legislation.",
    },
  ],
  numericIndicators: [
    {
      id: "gbv_referral_centres",
      label: "Number of Gender-Based Violence Referral Centres",
      value: 84,
      unit: "centres",
      trendPercentage: 12.5,
      description: "Total active referral centres with legal and psychosocial routing support.",
      series: [
        { name: "North West", value: 12 },
        { name: "North East", value: 10 },
        { name: "North Central", value: 14 },
        { name: "South West", value: 19 },
        { name: "South East", value: 13 },
        { name: "South South", value: 16 },
      ],
    },
  ],
};
