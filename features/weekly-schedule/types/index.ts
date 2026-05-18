type EnrollmentRecord = {
  id: string;
  academic_year_id: string;
  grade: string | number;
  section: string | null;
};

type TimetableTeacher = {
  id: string;
  first_name?: string | null;
  middle_name?: string | null;
  image?: string | null;
};

type TimetableRecord = {
  id: string;
  academic_year_id: string;
  grade: number | string;
  section: string;
  subject: string;
  teacher_id: string;
  day: WeekDay;
  period: string;
  note?: string | null;
  teacher?: TimetableTeacher;
};

type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

const DAYS: Array<{ value: WeekDay; title: string }> = [
  { value: "Mon", title: "Monday" },
  { value: "Tue", title: "Tuesday" },
  { value: "Wed", title: "Wednesday" },
  { value: "Thu", title: "Thursday" },
  { value: "Fri", title: "Friday" },
  { value: "Sat", title: "Saturday" },
  { value: "Sun", title: "Sunday" },
];

const dayByIndex: WeekDay[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export {
  dayByIndex,
  DAYS,
  EnrollmentRecord,
  TimetableRecord,
  TimetableTeacher,
  WeekDay,
};
