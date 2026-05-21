import { levels_of_education, stream } from "@/models";

export type StudentSubject = {
  label: string;
  value: string;
  Stream: stream;
  enable: boolean;
  levels_of_education: levels_of_education[];
  icon: React.ReactElement;
};

export type SubjectTabKey = "assessment" | "assignment";
