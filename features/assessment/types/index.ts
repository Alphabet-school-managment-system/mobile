import { Mark, Student } from "@/models";

type studentData = {
  id: string;
  student: Student;
  mark: Mark[];
};

type MarkFormProps = {
  data: studentData;
  assessmentId?: string;
  assessmentMax?: number;
  mark: Mark;
  onSuccess?: () => void;
};

type GradeSectionSelection = {
  grade?: string;
  section?: string;
};

type SelectedAssessment = {
  id?: string;
  title?: string;
  max_score?: number;
};

type UseAssessmentParams = {
  selectedGradeSec?: GradeSectionSelection;
  onAssessmentChange?: (assessment?: SelectedAssessment) => void;
};

export { MarkFormProps, SelectedAssessment, studentData, UseAssessmentParams };
