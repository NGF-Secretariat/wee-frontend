import { getLGAsByState, getStates } from "@some19ice/nigeria-geo-core";

export interface EducationStatePoint {
  stateId: string;
  stateName: string;
  value: number;
}

export interface EducationMockDataShape {
  literacy_english: {
    female: Record<string, number>;
    male: Record<string, number>;
  };
  literacy_local_language: {
    female: Record<string, number>;
    male: Record<string, number>;
  };
  literacy_quranic_arabic: {
    female: Record<string, number>;
    male: Record<string, number>;
  };
  school_attendance: {
    female: Record<string, number>;
    male: Record<string, number>;
  };
  girls_clubs: Record<string, number>;
  girls_enrollment: {
    primary: number;
    lower_secondary: number;
    higher_secondary: number;
    technical_colleges: number;
    tertiary: number;
  };
  girls_stem: {
    senior_secondary: number;
    tertiary: number;
  };
  education_attainment: {
    female: Record<string, number>;
    male: Record<string, number>;
  };
  curriculum: {
    socioemotional: number;
    digital: number;
    totalSchools: number;
    schoolsWithSocioemotional: number;
    schoolsWithDigital: number;
  };
}

const CORE_STATES = [
  "lagos",
  "kano",
  "rivers",
  "oyo",
  "kaduna",
  "enugu",
  "borno",
  "fct",
  "akwa-ibom",
  "anambra",
];

const toEntries = (rows: Array<[string, number]>): Record<string, number> =>
  Object.fromEntries(rows);

export const EDUCATION_MOCK_DATA: EducationMockDataShape = {
  literacy_english: {
    female: toEntries([
      ["lagos", 82],
      ["kano", 46],
      ["rivers", 71],
      ["oyo", 68],
      ["kaduna", 54],
      ["enugu", 78],
      ["borno", 37],
      ["fct", 80],
      ["akwa-ibom", 74],
      ["anambra", 79],
    ]),
    male: toEntries([
      ["lagos", 87],
      ["kano", 61],
      ["rivers", 77],
      ["oyo", 74],
      ["kaduna", 66],
      ["enugu", 83],
      ["borno", 49],
      ["fct", 86],
      ["akwa-ibom", 79],
      ["anambra", 85],
    ]),
  },
  literacy_local_language: {
    female: toEntries([
      ["lagos", 69],
      ["kano", 59],
      ["rivers", 66],
      ["oyo", 73],
      ["kaduna", 62],
      ["enugu", 75],
      ["borno", 51],
      ["fct", 67],
      ["akwa-ibom", 71],
      ["anambra", 77],
    ]),
    male: toEntries([
      ["lagos", 74],
      ["kano", 67],
      ["rivers", 72],
      ["oyo", 79],
      ["kaduna", 70],
      ["enugu", 80],
      ["borno", 58],
      ["fct", 72],
      ["akwa-ibom", 77],
      ["anambra", 82],
    ]),
  },
  literacy_quranic_arabic: {
    female: toEntries([
      ["lagos", 24],
      ["kano", 71],
      ["rivers", 19],
      ["oyo", 28],
      ["kaduna", 62],
      ["enugu", 17],
      ["borno", 67],
      ["fct", 31],
      ["akwa-ibom", 12],
      ["anambra", 11],
    ]),
    male: toEntries([
      ["lagos", 31],
      ["kano", 81],
      ["rivers", 24],
      ["oyo", 36],
      ["kaduna", 73],
      ["enugu", 22],
      ["borno", 76],
      ["fct", 41],
      ["akwa-ibom", 16],
      ["anambra", 15],
    ]),
  },
  school_attendance: {
    female: toEntries([
      ["lagos", 91],
      ["kano", 57],
      ["rivers", 84],
      ["oyo", 80],
      ["kaduna", 66],
      ["enugu", 88],
      ["borno", 49],
      ["fct", 89],
      ["akwa-ibom", 86],
      ["anambra", 87],
    ]),
    male: toEntries([
      ["lagos", 93],
      ["kano", 66],
      ["rivers", 87],
      ["oyo", 84],
      ["kaduna", 73],
      ["enugu", 90],
      ["borno", 58],
      ["fct", 91],
      ["akwa-ibom", 88],
      ["anambra", 90],
    ]),
  },
  girls_clubs: toEntries([
    ["lagos", 510],
    ["kano", 290],
    ["rivers", 245],
    ["oyo", 270],
    ["kaduna", 210],
    ["enugu", 190],
    ["borno", 120],
    ["fct", 165],
    ["akwa-ibom", 185],
    ["anambra", 205],
  ]),
  girls_enrollment: {
    primary: 78,
    lower_secondary: 64,
    higher_secondary: 52,
    technical_colleges: 34,
    tertiary: 39,
  },
  girls_stem: {
    senior_secondary: 36,
    tertiary: 28,
  },
  education_attainment: {
    female: {
      "No formal": 18,
      Primary: 31,
      Secondary: 34,
      Tertiary: 17,
    },
    male: {
      "No formal": 11,
      Primary: 27,
      Secondary: 38,
      Tertiary: 24,
    },
  },
  curriculum: {
    socioemotional: 61,
    digital: 47,
    totalSchools: 12540,
    schoolsWithSocioemotional: 7649,
    schoolsWithDigital: 5894,
  },
};

const stateLookup = new Map(getStates().map((state) => [state.id, state.name]));

export function getChoroplethForIndicator(indicatorId: string): Record<string, number> {
  switch (indicatorId) {
    case "literacy_english_female":
      return EDUCATION_MOCK_DATA.literacy_english.female;
    case "literacy_english_male":
      return EDUCATION_MOCK_DATA.literacy_english.male;
    case "literacy_local_language_female":
      return EDUCATION_MOCK_DATA.literacy_local_language.female;
    case "literacy_local_language_male":
      return EDUCATION_MOCK_DATA.literacy_local_language.male;
    case "literacy_quranic_arabic_female":
      return EDUCATION_MOCK_DATA.literacy_quranic_arabic.female;
    case "literacy_quranic_arabic_male":
      return EDUCATION_MOCK_DATA.literacy_quranic_arabic.male;
    case "school_attendance_female":
      return EDUCATION_MOCK_DATA.school_attendance.female;
    case "school_attendance_male":
      return EDUCATION_MOCK_DATA.school_attendance.male;
    case "secondary_schools_with_girls_clubs":
      return EDUCATION_MOCK_DATA.girls_clubs;
    default:
      return EDUCATION_MOCK_DATA.literacy_english.female;
  }
}

export function getStateSeriesFromMap(data: Record<string, number>): EducationStatePoint[] {
  return Object.entries(data)
    .map(([stateId, value]) => ({
      stateId,
      stateName: stateLookup.get(stateId) ?? stateId,
      value,
    }))
    .sort((a, b) => b.value - a.value);
}

export function getGenderComparisonData(pairKey: string) {
  const source =
    pairKey === "literacy_english"
      ? EDUCATION_MOCK_DATA.literacy_english
      : pairKey === "literacy_local_language"
        ? EDUCATION_MOCK_DATA.literacy_local_language
        : pairKey === "literacy_quranic_arabic"
          ? EDUCATION_MOCK_DATA.literacy_quranic_arabic
          : EDUCATION_MOCK_DATA.school_attendance;

  return CORE_STATES.map((stateId) => ({
    stateId,
    stateName: stateLookup.get(stateId) ?? stateId,
    female: source.female[stateId] ?? 0,
    male: source.male[stateId] ?? 0,
  }));
}

export function getEnrollmentComparisonData() {
  const enrollment = EDUCATION_MOCK_DATA.girls_enrollment;
  return [
    { level: "Primary", value: enrollment.primary },
    { level: "Lower Sec.", value: enrollment.lower_secondary },
    { level: "Higher Sec.", value: enrollment.higher_secondary },
    { level: "Technical", value: enrollment.technical_colleges },
    { level: "Tertiary", value: enrollment.tertiary },
  ];
}

export function getStemComparisonData() {
  return [
    { level: "Senior Secondary", value: EDUCATION_MOCK_DATA.girls_stem.senior_secondary },
    { level: "Tertiary", value: EDUCATION_MOCK_DATA.girls_stem.tertiary },
  ];
}

export function getAttainmentData(type: "female" | "male") {
  const raw = type === "female" ? EDUCATION_MOCK_DATA.education_attainment.female : EDUCATION_MOCK_DATA.education_attainment.male;
  return Object.entries(raw).map(([name, value]) => ({ name, value }));
}

export function getKPIValue(indicatorId: string): { value: number; subtitle: string } {
  if (indicatorId === "socioemotional_curriculum") {
    return {
      value: EDUCATION_MOCK_DATA.curriculum.socioemotional,
      subtitle: `${EDUCATION_MOCK_DATA.curriculum.schoolsWithSocioemotional.toLocaleString()} schools covered`,
    };
  }

  return {
    value: EDUCATION_MOCK_DATA.curriculum.digital,
    subtitle: `${EDUCATION_MOCK_DATA.curriculum.schoolsWithDigital.toLocaleString()} schools covered`,
  };
}

function deterministicValue(seed: string, min: number, max: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const normalized = Math.abs(hash % 1000) / 1000;
  return Math.round(min + normalized * (max - min));
}

export function getLGAChoropleth(stateId: string, indicatorId: string): Record<string, number> {
  const lgas = getLGAsByState(stateId);

  return lgas.reduce<Record<string, number>>((acc, lga) => {
    const baseRange = indicatorId === "secondary_schools_with_girls_clubs" ? [5, 80] : [20, 95];
    acc[lga.id] = deterministicValue(`${stateId}-${indicatorId}-${lga.id}`, baseRange[0], baseRange[1]);
    return acc;
  }, {});
}

export function getLegendForIndicator(indicatorId: string) {
  if (indicatorId.includes("attainment")) {
    return [
      { label: "No formal", color: "#ef4444" },
      { label: "Primary", color: "#f59e0b" },
      { label: "Secondary", color: "#22c55e" },
      { label: "Tertiary", color: "#2563eb" },
    ];
  }

  if (indicatorId.includes("curriculum")) {
    return [
      { label: "Coverage", color: "#10b981" },
      { label: "Gap", color: "#d1d5db" },
    ];
  }

  if (indicatorId.includes("male") || indicatorId.includes("female")) {
    return [
      { label: "Female", color: "#ec4899" },
      { label: "Male", color: "#3b82f6" },
    ];
  }

  return [
    { label: "Higher values", color: "#16a34a" },
    { label: "Lower values", color: "#d1fae5" },
  ];
}

export function getIndicatorTakeaway(indicatorId: string) {
  if (indicatorId.includes("literacy_english")) {
    return "English literacy remains strongest in Lagos, FCT, and South-East states, with wider gender gaps in northern zones.";
  }

  if (indicatorId.includes("quranic")) {
    return "Quranic/Arabic literacy is concentrated in northern states and shows visible male-female differences in participation.";
  }

  if (indicatorId.includes("enrollment")) {
    return "Enrollment drops as girls move from primary to upper levels, especially in technical and tertiary pathways.";
  }

  if (indicatorId.includes("stem")) {
    return "Girls' STEM participation is stronger at senior secondary than tertiary, indicating a transition bottleneck.";
  }

  if (indicatorId.includes("attainment")) {
    return "Secondary completion is the largest attainment group, while tertiary attainment still trails for both genders.";
  }

  if (indicatorId.includes("attendance")) {
    return "Attendance is relatively high in southern urban states but weaker in conflict-affected and underserved areas.";
  }

  if (indicatorId.includes("girls_clubs")) {
    return "Girls clubs are clustered in large education systems, with room to scale in northern and conflict-affected states.";
  }

  return "Curriculum coverage is improving, but many schools still lack consistent socioemotional and digital content.";
}
