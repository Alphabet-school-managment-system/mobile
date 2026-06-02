import { useContext, useMemo } from "react";
import { UserContext } from "@/store/providers/UserContext";
import { useUtil } from "@/hooks/useUtil";
import { stream } from "@/models";

type UseStudentHomeOptions = {
  grade?: number | string | null;
  stream?: stream | null;
};

export const useStudentHome = (options?: UseStudentHomeOptions) => {
  const { userData } = useContext(UserContext);
  const { getSubjectsForEnrollment, getGradeLabel, getEducationLevelFromGrade } =
    useUtil();

  const grade = options?.grade ?? userData?.grade;
  const enrollmentStream = options?.stream ?? userData?.stream;

  const educationLevel = useMemo(
    () => getEducationLevelFromGrade(grade),
    [getEducationLevelFromGrade, grade],
  );

  const subjects = useMemo(
    () => getSubjectsForEnrollment(grade, enrollmentStream),
    [enrollmentStream, getSubjectsForEnrollment, grade],
  );

  return {
    userData,
    educationLevel,
    getGradeLabel,
    subjects,
  };
};
