import { useApiQuery } from "@/hooks/useApi";
import { levels_of_education, selectType } from "@/models";

const gradeMap: Record<levels_of_education, { label: string; value: number }[]> =
  {
    kg: [
      { label: "KG - 1", value: -2 },
      { label: "KG - 2", value: -1 },
      { label: "KG - 3", value: 0 },
    ],
    primary: [
      { label: "Grade 1", value: 1 },
      { label: "Grade 2", value: 2 },
      { label: "Grade 3", value: 3 },
      { label: "Grade 4", value: 4 },
      { label: "Grade 5", value: 5 },
      { label: "Grade 6", value: 6 },
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

  return {
    getGrades,
    getGradeLabel,
    ServerDate,
    gettingServerDate,
  };
};
