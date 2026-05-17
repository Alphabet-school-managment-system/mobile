import { DAYS, TimetableTeacher, WeekDay } from "../types";

export const useStudentWeeklySchedule = () => {
  const getTeacherName = (teacher?: TimetableTeacher) =>
    [teacher?.first_name, teacher?.middle_name]
      .filter((part) => Boolean(part && String(part).trim()))
      .join(" ")
      .trim();

  const getDayTitle = (day: WeekDay) =>
    DAYS.find((item) => item.value === day)?.title ?? day;

  const getPeriodOrder = (period: string) => {
    const numericMatch = String(period).match(/\d+/);
    return numericMatch ? Number(numericMatch[0]) : Number.MAX_SAFE_INTEGER;
  };

  return { getTeacherName, getDayTitle, getPeriodOrder };
};
