import type { HealthIndicator } from "@/app/lib/health-indicator-config";

export interface HealthMockData {
  insurance_enrolment: {
    female: number;
    male: number;
    byZone: Array<{ name: string; female: number; male: number }>;
  };
  life_expectancy: {
    female: number;
    male: number;
    byZone: Array<{ name: string; female: number; male: number }>;
  };
  maternal_mortality: number;
  violence_rate: number;
  sexual_violence_by_age: Array<{ name: string; value: number }>;
  reproductive_health_access: Array<{ name: string; value: number }>;
  age_first_marriage: number;
  parity: Array<{ name: string; value: number }>;
  polygamy: {
    yes: number;
    no: number;
  };
}

export const HEALTH_MOCK_DATA: HealthMockData = {
  insurance_enrolment: {
    female: 35,
    male: 50,
    byZone: [
      { name: "North West", female: 26, male: 39 },
      { name: "North East", female: 23, male: 35 },
      { name: "North Central", female: 31, male: 45 },
      { name: "South West", female: 47, male: 63 },
      { name: "South East", female: 40, male: 56 },
      { name: "South South", female: 43, male: 58 },
    ],
  },
  life_expectancy: {
    female: 60,
    male: 55,
    byZone: [
      { name: "North West", female: 56, male: 52 },
      { name: "North East", female: 55, male: 51 },
      { name: "North Central", female: 59, male: 54 },
      { name: "South West", female: 63, male: 58 },
      { name: "South East", female: 62, male: 57 },
      { name: "South South", female: 61, male: 56 },
    ],
  },
  maternal_mortality: 512,
  violence_rate: 28,
  sexual_violence_by_age: [
    { name: "15-19", value: 14 },
    { name: "20-24", value: 19 },
    { name: "25-34", value: 17 },
    { name: "35-49", value: 11 },
  ],
  reproductive_health_access: [
    { name: "Primary Facilities", value: 58 },
    { name: "Secondary Facilities", value: 67 },
    { name: "Tertiary Facilities", value: 74 },
    { name: "Community Outreach", value: 49 },
  ],
  age_first_marriage: 19.4,
  parity: [
    { name: "Urban", value: 3.6 },
    { name: "Rural", value: 5.2 },
    { name: "National", value: 4.3 },
  ],
  polygamy: {
    yes: 30,
    no: 70,
  },
};

export function getHealthChartData(indicator: HealthIndicator, data: HealthMockData) {
  switch (indicator.id) {
    case "health_insurance_female":
    case "health_insurance_male":
      return data.insurance_enrolment.byZone;

    case "life_expectancy_female":
    case "life_expectancy_male":
      return data.life_expectancy.byZone;

    case "incidence_sexual_violence":
      return data.sexual_violence_by_age;

    case "reproductive_health_access":
      return data.reproductive_health_access;

    case "parity_children":
      return data.parity;

    case "women_polygamy":
      return [
        { name: "In Polygamy", value: data.polygamy.yes },
        { name: "Not in Polygamy", value: data.polygamy.no },
      ];

    case "violence_against_women_girls":
      return data.violence_rate;

    case "maternal_mortality_rate":
      return data.maternal_mortality;

    case "age_first_marriage":
      return data.age_first_marriage;

    default:
      return [];
  }
}

export function getSensitiveNote(indicator: HealthIndicator): string {
  if (indicator.id === "maternal_mortality_rate") {
    return "Interpret with caution: mortality metrics can mask regional inequities and quality-of-care gaps.";
  }

  if (indicator.category === "violence") {
    return "Sensitive indicator: underreporting is common; values should be read as minimum estimates.";
  }

  return "Context note: combine this indicator with geography, income, and service availability for better interpretation.";
}

export function getTakeaway(indicator: HealthIndicator): string {
  switch (indicator.id) {
    case "health_insurance_female":
    case "health_insurance_male":
      return "Insurance enrolment remains higher for males across all zones, with the largest gaps in northern zones.";
    case "violence_against_women_girls":
      return "More than one in four women and girls report violence exposure, indicating an urgent need for prevention and support systems.";
    case "incidence_sexual_violence":
      return "Incidence is highest among younger women, which suggests targeting adolescent and young-adult protection programs.";
    case "reproductive_health_access":
      return "Service access is stronger at higher-level facilities than at community channels, creating inequitable frontline coverage.";
    case "maternal_mortality_rate":
      return "Maternal mortality remains critically high and requires sustained investments in skilled birth attendance and emergency obstetric care.";
    case "life_expectancy_female":
    case "life_expectancy_male":
      return "Female life expectancy exceeds male life expectancy across zones, though both vary by service access and living conditions.";
    case "age_first_marriage":
      return "Earlier marriage is associated with lower education continuation and elevated reproductive health risks.";
    case "parity_children":
      return "Parity is higher in rural settings, reflecting differences in education, health service access, and family planning uptake.";
    case "women_polygamy":
      return "A notable share of women are in polygamous unions, which can shape household decision-making and health access patterns.";
    default:
      return "This indicator provides a useful snapshot for planning policy and program priorities.";
  }
}
