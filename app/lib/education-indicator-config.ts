export type EducationIndicatorCategory =
  | "literacy"
  | "enrollment"
  | "education"
  | "skills";

export type EducationIndicatorType = "female" | "male" | "general";

export type EducationPreferredChart = "map" | "bar" | "pie" | "kpi";

export interface EducationIndicatorMetadata {
  id: string;
  label: string;
  category: EducationIndicatorCategory;
  type: EducationIndicatorType;
  preferredChart: EducationPreferredChart;
  description: string;
  unit?: string;
  pairKey?: string;
}

export const EDUCATION_CATEGORY_LABELS: Record<EducationIndicatorCategory, string> = {
  literacy: "Literacy",
  enrollment: "Enrollment",
  education: "Education",
  skills: "Skills",
};

export const EDUCATION_INDICATORS: EducationIndicatorMetadata[] = [
  {
    id: "literacy_english_female",
    label: "English literacy rates - female",
    category: "literacy",
    type: "female",
    preferredChart: "map",
    description: "Share of girls and women with functional English literacy by state.",
    unit: "%",
    pairKey: "literacy_english",
  },
  {
    id: "literacy_english_male",
    label: "English literacy rates - male",
    category: "literacy",
    type: "male",
    preferredChart: "bar",
    description: "Female vs male English literacy comparison across states.",
    unit: "%",
    pairKey: "literacy_english",
  },
  {
    id: "literacy_local_language_female",
    label: "Local language literacy rates - female",
    category: "literacy",
    type: "female",
    preferredChart: "map",
    description: "Share of females literate in local Nigerian languages by state.",
    unit: "%",
    pairKey: "literacy_local_language",
  },
  {
    id: "literacy_local_language_male",
    label: "Local language literacy rates - male",
    category: "literacy",
    type: "male",
    preferredChart: "bar",
    description: "Female vs male local language literacy comparison across states.",
    unit: "%",
    pairKey: "literacy_local_language",
  },
  {
    id: "literacy_quranic_arabic_female",
    label: "Quranic/Arabic literacy rates - female",
    category: "literacy",
    type: "female",
    preferredChart: "map",
    description: "Female literacy in Quranic/Arabic studies by state.",
    unit: "%",
    pairKey: "literacy_quranic_arabic",
  },
  {
    id: "literacy_quranic_arabic_male",
    label: "Quranic/Arabic literacy rates - male",
    category: "literacy",
    type: "male",
    preferredChart: "bar",
    description: "Female vs male Quranic/Arabic literacy comparison across states.",
    unit: "%",
    pairKey: "literacy_quranic_arabic",
  },
  {
    id: "girls_enrollment_primary",
    label: "Girls enrollment in primary school",
    category: "enrollment",
    type: "female",
    preferredChart: "bar",
    description: "Comparison of girls enrollment across education levels.",
    unit: "%",
  },
  {
    id: "girls_enrollment_lower_secondary",
    label: "Girls enrollment in lower secondary school",
    category: "enrollment",
    type: "female",
    preferredChart: "bar",
    description: "Comparison of girls enrollment across education levels.",
    unit: "%",
  },
  {
    id: "girls_enrollment_higher_secondary",
    label: "Girls enrollment in higher secondary school",
    category: "enrollment",
    type: "female",
    preferredChart: "bar",
    description: "Comparison of girls enrollment across education levels.",
    unit: "%",
  },
  {
    id: "girls_enrollment_technical_colleges",
    label: "Girls enrollment in technical colleges",
    category: "enrollment",
    type: "female",
    preferredChart: "bar",
    description: "Comparison of girls enrollment across education levels.",
    unit: "%",
  },
  {
    id: "girls_enrollment_tertiary",
    label: "Girls enrollment in tertiary school",
    category: "enrollment",
    type: "female",
    preferredChart: "bar",
    description: "Comparison of girls enrollment across education levels.",
    unit: "%",
  },
  {
    id: "girls_stem_senior_secondary",
    label: "Girls studying STEM courses - senior secondary",
    category: "skills",
    type: "female",
    preferredChart: "bar",
    description: "STEM participation comparison between senior secondary and tertiary levels.",
    unit: "%",
  },
  {
    id: "girls_stem_tertiary",
    label: "Girls studying STEM courses - tertiary",
    category: "skills",
    type: "female",
    preferredChart: "bar",
    description: "STEM participation comparison between senior secondary and tertiary levels.",
    unit: "%",
  },
  {
    id: "highest_education_attainment_female",
    label: "Highest education attainment - female",
    category: "education",
    type: "female",
    preferredChart: "pie",
    description: "Distribution of highest attained education levels among females.",
    unit: "%",
  },
  {
    id: "highest_education_attainment_male",
    label: "Highest education attainment - male",
    category: "education",
    type: "male",
    preferredChart: "pie",
    description: "Distribution of highest attained education levels among males.",
    unit: "%",
  },
  {
    id: "school_attendance_female",
    label: "School attendance rate - female",
    category: "education",
    type: "female",
    preferredChart: "map",
    description: "Female school attendance by state.",
    unit: "%",
    pairKey: "school_attendance",
  },
  {
    id: "school_attendance_male",
    label: "School attendance rate - male",
    category: "education",
    type: "male",
    preferredChart: "bar",
    description: "Female vs male school attendance comparison by state.",
    unit: "%",
    pairKey: "school_attendance",
  },
  {
    id: "secondary_schools_with_girls_clubs",
    label: "Number of secondary schools with girls clubs",
    category: "education",
    type: "general",
    preferredChart: "map",
    description: "Geographic distribution of secondary schools offering girls clubs.",
    unit: "schools",
  },
  {
    id: "socioemotional_curriculum",
    label: "Socioemotional skills training curriculum for schools",
    category: "skills",
    type: "general",
    preferredChart: "kpi",
    description: "Share of schools with a socioemotional learning curriculum.",
    unit: "%",
  },
  {
    id: "digital_skills_curriculum",
    label: "Digital skills training curriculum for schools",
    category: "skills",
    type: "general",
    preferredChart: "kpi",
    description: "Share of schools with a digital skills curriculum.",
    unit: "%",
  },
];

export function getEducationIndicators(): EducationIndicatorMetadata[] {
  return EDUCATION_INDICATORS;
}

export function getEducationIndicatorById(
  id: string
): EducationIndicatorMetadata | undefined {
  return EDUCATION_INDICATORS.find((indicator) => indicator.id === id);
}

export function getEducationIndicatorsByCategory(
  category: EducationIndicatorCategory
): EducationIndicatorMetadata[] {
  return EDUCATION_INDICATORS.filter((indicator) => indicator.category === category);
}
