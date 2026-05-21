import { useContext, useMemo } from "react";
import { UserContext } from "@/store/providers/UserContext";
import { useUtil } from "@/hooks/useUtil";

export const useStudentHome = () => {
  const { userData } = useContext(UserContext);
  const { getSubjectsForEnrollment, getGradeLabel, getEducationLevelFromGrade } =
    useUtil();

  const educationLevel = useMemo(
    () => getEducationLevelFromGrade(userData?.grade),
    [getEducationLevelFromGrade, userData?.grade],
  );

  const subjects = useMemo(
    () => getSubjectsForEnrollment(userData?.grade, userData?.stream),
    [getSubjectsForEnrollment, userData?.grade, userData?.stream],
  );

  return {
    userData,
    educationLevel,
    getGradeLabel,
    subjects,
  };
};
