import { Attendance, AttendanceStatus, Student } from "@/models";

type AttendanceStudentData = {
  info: Student;
  attendance?: Attendance | null;
};

type AttendanceFormProps = {
  student?: AttendanceStudentData;
  selectedDate: Date;
  academicYearId?: string | null;
  attendanceQueryKey: string[];
  onSaved: () => void;
};

const AttendanceStatusOptions: AttendanceStatus[] = [
  "Present",
  "Absent",
  "Excused",
];

export { AttendanceFormProps, AttendanceStatusOptions, AttendanceStudentData };
