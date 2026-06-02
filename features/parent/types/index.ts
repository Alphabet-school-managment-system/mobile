import {
  Assessment,
  Behavior,
  Enrollment,
  stream,
  Student,
  Teacher,
} from "@/models";

export type StudentWithEnrollment = {
  enrollment: Enrollment & { student: Student };
};

export type MyAssessment = Assessment & {
  subject: string;
  mark: {
    score: number | null;
  };
};

export type SubjectAssessmentGroup = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  assessments: MyAssessment[];
};

export type StudentAssessmentReportProps = {
  studentId?: string;
  grade?: string | number | null;
  section?: string | null;
  stream?: stream | null;
  academicYearId?: string | null;
};

export type BehaviorReportRecord = Behavior & {
  enrollment?: {
    id: string;
    grade: string;
    section?: string | null;
    student?: Student;
  };
  teacher: Teacher;
};

export type StudentBehaviorReportProps = {
  studentId?: string;
  academicYearId?: string | null;
};

export const BEHAVIOR_THEME = {
  Positive: {
    cardBg: "#ECFDF5",
    border: "#A7F3D0",
    accent: "#10B981",
    accentSoft: "#D1FAE5",
    text: "#047857",
  },
  Negative: {
    cardBg: "#FEF2F2",
    border: "#FECACA",
    accent: "#DC2626",
    accentSoft: "#FEE2E2",
    text: "#B91C1C",
  },
} as const;
