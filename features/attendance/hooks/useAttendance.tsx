import { AttendanceStatus } from "@/models";

export const useAttendance = () => {
  const getStatusTextClass = (status?: AttendanceStatus) => {
    if (status === "Present") return "text-green-600";
    if (status === "Absent") return "text-red-600";
    if (status === "Excused") return "text-amber-600";
    return "text-gray-400";
  };

  return { getStatusTextClass };
};
