import { useApiQuery } from "@/hooks/useApi";
import { levels_of_education, selectType, stream } from "@/models";
import dayjs from "dayjs";
import { ReactElement } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const gradeMap: Record<
  levels_of_education,
  { label: string; value: number }[]
> = {
  kg: [
    { label: "KG - 1", value: -2 },
    { label: "KG - 2", value: -1 },
    { label: "KG - 3", value: 0 },
  ],
  lower_primary: [
    { label: "Grade 1", value: 1 },
    { label: "Grade 2", value: 2 },
    { label: "Grade 3", value: 3 },
    { label: "Grade 4", value: 4 },
  ],
  middle_primary: [
    { label: "Grade 5", value: 5 },
    { label: "Grade 6", value: 6 },
  ],
  upper_primary: [
    { label: "Grade 7", value: 7 },
    { label: "Grade 8", value: 8 },
  ],
  secondary: [
    { label: "Grade 9", value: 9 },
    { label: "Grade 10", value: 10 },
  ],
  college_prep: [
    { label: "Grade 11", value: 11 },
    { label: "Grade 12", value: 12 },
  ],
};

export const getGradeLabel = (grade: number) => {
  const gradeLabels: Record<string, string> = {
    "-2": "KG - 1",
    "-1": "KG - 2",
    "0": "KG - 3",
    "1": "Grade 1",
    "2": "Grade 2",
    "3": "Grade 3",
    "4": "Grade 4",
    "5": "Grade 5",
    "6": "Grade 6",
    "7": "Grade 7",
    "8": "Grade 8",
    "9": "Grade 9",
    "10": "Grade 10",
    "11": "Grade 11",
    "12": "Grade 12",
  };
  return gradeLabels[String(grade)] || "-";
};

const subjects: {
  label: string;
  value: string;
  Stream: stream;
  enable: boolean;
  levels_of_education: levels_of_education[];
  icon: ReactElement;
}[] = [
  {
    label: "Mother Tongue Language",
    value: "mother_tongue_language",
    Stream: "General",
    enable: true,
    levels_of_education: [
      "kg",
      "lower_primary",
      "middle_primary",
      "upper_primary",
    ],
    icon: <MaterialCommunityIcons name="translate" size={24} color="#000" />,
  },
  {
    label: "Amharic language",
    value: "amharic_language",
    Stream: "General",
    enable: true,
    levels_of_education: ["middle_primary", "upper_primary", "secondary"],
    icon: <MaterialCommunityIcons name="translate" size={24} color="#000" />,
  },
  {
    label: "Physics",
    value: "physics",
    Stream: "Natural_Sciences",
    enable: true,
    levels_of_education: ["upper_primary", "secondary", "college_prep"],
    icon: <MaterialCommunityIcons name="atom" size={24} color="#000" />,
  },
  {
    label: "Chemistry",
    value: "chemistry",
    Stream: "Natural_Sciences",
    enable: true,
    levels_of_education: ["upper_primary", "secondary", "college_prep"],
    icon: <MaterialCommunityIcons name="flask" size={24} color="#000" />,
  },
  {
    label: "Biology",
    value: "biology",
    Stream: "Natural_Sciences",
    enable: true,
    levels_of_education: ["upper_primary", "secondary", "college_prep"],
    icon: <MaterialCommunityIcons name="dna" size={24} color="#000" />,
  },
  {
    label: "History",
    value: "history",
    Stream: "Social_Sciences",
    enable: true,
    levels_of_education: ["secondary", "college_prep"],
    icon: <MaterialCommunityIcons name="history" size={24} color="#000" />,
  },
  {
    label: "Geography",
    value: "geography",
    Stream: "Social_Sciences",
    enable: true,
    levels_of_education: ["secondary", "college_prep"],
    icon: <MaterialCommunityIcons name="earth" size={24} color="#000" />,
  },
  {
    label: "Economics",
    value: "economics",
    Stream: "Social_Sciences",
    enable: true,
    levels_of_education: ["college_prep"],
    icon: <MaterialCommunityIcons name="currency-usd" size={24} color="#000" />,
  },
  {
    label: "Business Studies",
    value: "business_studies",
    Stream: "Social_Sciences",
    enable: true,
    levels_of_education: ["college_prep"],
    icon: <MaterialCommunityIcons name="briefcase" size={24} color="#000" />,
  },
  {
    label: "Technical Drawing",
    value: "technical_drawing",
    Stream: "Natural_Sciences",
    enable: true,
    levels_of_education: ["college_prep"],
    icon: <MaterialCommunityIcons name="vector-line" size={24} color="#000" />,
  },

  {
    label: "Mathematics",
    value: "mathematics",
    Stream: "General",
    enable: true,
    levels_of_education: [
      "kg",
      "lower_primary",
      "middle_primary",
      "upper_primary",
      "secondary",
      "college_prep",
    ],
    icon: <MaterialCommunityIcons name="calculator" size={24} color="#000" />,
  },
  {
    label: "English",
    value: "english",
    Stream: "General",
    enable: true,
    levels_of_education: [
      "kg",
      "lower_primary",
      "middle_primary",
      "upper_primary",
      "secondary",
      "college_prep",
    ],
    icon: <MaterialCommunityIcons name="alphabetical" size={24} color="#000" />,
  },
  {
    label: "Citizenship Education",
    value: "citizenship_education",
    Stream: "General",
    enable: true,
    levels_of_education: [
      "middle_primary",
      "upper_primary",
      "secondary",
      "college_prep",
    ],
    icon: (
      <MaterialCommunityIcons name="account-group" size={24} color="#000" />
    ),
  },
  {
    label: "Physical Education (PE)",
    value: "physical_education",
    Stream: "General",
    enable: true,
    levels_of_education: [
      "lower_primary",
      "middle_primary",
      "upper_primary",
      "secondary",
    ],
    icon: <MaterialCommunityIcons name="run" size={24} color="#000" />,
  },
  {
    label: "Information Technology (IT)",
    value: "information_technology",
    Stream: "General",
    enable: true,
    levels_of_education: ["upper_primary", "secondary", "college_prep"],
    icon: <MaterialCommunityIcons name="laptop" size={24} color="#000" />,
  },

  {
    label: "Performing and Visual Arts (PVA)",
    value: "performing_and_visual_arts",
    Stream: "General",
    enable: true,
    levels_of_education: ["lower_primary", "middle_primary"],
    icon: <MaterialCommunityIcons name="palette" size={24} color="#000" />,
  },
  {
    label: "Environmental Science",
    value: "environmental_science",
    Stream: "General",
    enable: true,
    levels_of_education: ["lower_primary"],
    icon: <MaterialCommunityIcons name="tree" size={24} color="#000" />,
  },
  {
    label: "Social Studies",
    value: "social_studies",
    Stream: "General",
    enable: true,
    levels_of_education: ["middle_primary", "upper_primary"],
    icon: (
      <MaterialCommunityIcons name="account-group" size={24} color="#000" />
    ),
  },
  {
    label: "General Science",
    value: "general_science",
    Stream: "General",
    enable: true,
    levels_of_education: ["middle_primary"],
    icon: <MaterialCommunityIcons name="science" size={24} color="#000" />,
  },
];

const get_speciality_label = (value: string): string => {
  return subjects.find((s) => s.value === value)?.label ?? "Unknown";
};

const getEducationLevelFromGrade = (
  grade?: number | string | null,
): levels_of_education | undefined => {
  if (grade === undefined || grade === null || grade === "") {
    return undefined;
  }

  const numericGrade = Number(grade);
  if (Number.isNaN(numericGrade)) {
    return undefined;
  }

  if (numericGrade >= 1 && numericGrade <= 4) return "lower_primary";
  if (numericGrade >= 5 && numericGrade <= 6) return "middle_primary";
  if (numericGrade >= 7 && numericGrade <= 8) return "upper_primary";
  if (numericGrade >= 9 && numericGrade <= 10) return "secondary";
  return "college_prep";
};

export const useUtil = () => {
  const { data: ServerDate, isLoading: gettingServerDate } = useApiQuery<any>(
    [`util/server-date`],
    `util/server-date`,
  );

  const getGrades = (
    input: levels_of_education | levels_of_education[],
  ): selectType[] => {
    const types = Array.isArray(input) ? input : [input];
    return types
      .flatMap((type) => gradeMap[type])
      .map((g) => ({ label: g.label, value: g.value }));
  };

  const GRADE_VALUES = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const formatDate = (value?: string | Date | null) => {
    if (!value) return "-";
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format("MMM D, YYYY") : String(value);
  };

  const getSubjectsForEnrollment = (
    grade?: number | string | null,
    enrollmentStream?: stream | null,
  ) => {
    const educationLevel = getEducationLevelFromGrade(grade);

    return subjects.filter((subject) => {
      if (!subject.enable) {
        return false;
      }

      const matchesLevel =
        !educationLevel || subject.levels_of_education.includes(educationLevel);
      const matchesStream =
        !enrollmentStream ||
        subject.Stream === "General" ||
        subject.Stream === enrollmentStream;

      return matchesLevel && matchesStream;
    });
  };

  return {
    getGrades,
    getGradeLabel,
    getEducationLevelFromGrade,
    ServerDate,
    gettingServerDate,
    get_speciality_label,
    getSubjectsForEnrollment,
    subjects,
    GRADE_VALUES,
    formatDate,
  };
};
