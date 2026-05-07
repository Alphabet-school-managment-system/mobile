import { Behavior, Student } from "@/models";

type BehaviorReportDetail = Behavior & {
  enrollment?: {
    id: string;
    grade: string;
    section: string;
    student?: Student;
  };
};

type BehaviorStudentData = {
  id: string;
  student: Student;
};

type BehaviorFilter = "all" | "Positive" | "Negative";

type BehaviorWithEnrollment = Behavior & {
  enrollment: {
    id: string;
    grade: string;
    section: string;
    student: Student;
  };
};

type BehaviorReportItemProps = {
  item: BehaviorWithEnrollment;
};

export {
  BehaviorFilter,
  BehaviorReportDetail,
  BehaviorReportItemProps,
  BehaviorStudentData,
  BehaviorWithEnrollment
};

