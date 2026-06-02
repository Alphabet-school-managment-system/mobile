import FlatList from "@/components/common/flatList";
import { Text } from "@/components/ui/text";
import { Attendance } from "@/models";
import { UtilContext } from "@/store/providers/UtilContext";
import dayjs from "dayjs";
import { useContext, useMemo } from "react";
import { View } from "react-native";
import { useParent } from "../hooks/useParent";
import { WeeklyAttendanceCard } from "./WeeklyAttendance/WeeklyAttendanceCard";

export const StudentWeeklyAttendance = ({
  student_id,
}: {
  student_id: string;
}) => {
  const { Util } = useContext(UtilContext);
  const { buildMondayWeekRange } = useParent();
  const weekDays = useMemo(
    () => buildMondayWeekRange(Util.serverDate),
    [Util.serverDate],
  );

  const weekLabel = useMemo(() => {
    const start = weekDays[0];
    const end = weekDays[weekDays.length - 1];

    if (!start || !end) return "";

    return `${start.format("MMM D, YYYY")} - ${end.format("MMM D, YYYY")}`;
  }, [weekDays]);

  const buildAttendanceEndpoint = ({ student_id }: { student_id?: string }) => {
    if (!student_id) return "";

    const startDate = weekDays[0]?.format("YYYY-MM-DD");
    const endDate = weekDays[weekDays.length - 1]?.format("YYYY-MM-DD");
    if (!startDate || !endDate) return "";

    const params = new URLSearchParams();
    params.set("student_id", student_id);
    params.set("date__between", `${startDate},${endDate}`);
    params.set("__and", "student_id,date__between");

    return `attendance/search?${params.toString()}`;
  };

  const endpoint = buildAttendanceEndpoint({ student_id });

  return (
    <FlatList<Attendance>
      enableFetch={true}
      apiEndpoint={endpoint}
      header={
        <View className="overflow-hidden">
          <View className="rounded-lg border p-4 bg-white">
            <Text
              className="mt-1 text-gray-900 text-center font-bold"
              variant="titleMedium"
            >
              {`Attendance record for the week of ${weekLabel}.`}
            </Text>
          </View>
        </View>
      }
      emptyDataTitle={
        <View className="mt-4 overflow-hidden ">
          <View className="items-center px-5 py-8">
            <Text className="text-center text-gray-900" variant="titleMedium">
              No attendance found
            </Text>
            <Text
              className="mt-2 text-center text-gray-500"
              variant="bodyMedium"
            >
              We couldn’t find an attendance record for this student on the
              selected day yet.
            </Text>
          </View>
        </View>
      }
      renderItem={({ item }) => <WeeklyAttendanceCard item={item} />}
      alternateRowStyle={false}
      containerClassName="bg-slate-100"
      contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 24 }}
      keyExtractor={(item) => dayjs(item.date).format("YYYY-MM-DD")}
    />
  );
};

export default StudentWeeklyAttendance;
