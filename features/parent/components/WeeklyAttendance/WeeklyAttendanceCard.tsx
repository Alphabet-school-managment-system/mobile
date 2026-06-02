import { Text } from "@/components/ui/text";
import { useAttendance } from "@/features/attendance/hooks/useAttendance";
import { Attendance } from "@/models";
import dayjs from "dayjs";
import { View } from "react-native";
import { useParent } from "../../hooks/useParent";

export const WeeklyAttendanceCard = ({ item }: { item: Attendance }) => {
  const { getStatusTextClass } = useAttendance();
  const { getStatusDotStyle, getStatusPillStyle } = useParent();

  return (
    <View className="mt-4 flex-row items-center justify-between rounded-lg bg-gray-100 px-4 py-4 shadow-sm">
      <View className="flex-1 pr-3">
        <Text className="text-gray-900" variant="titleMedium">
          {dayjs(item.date).format("dddd")}
        </Text>
        <Text className="mt-1 text-gray-500" variant="bodySmall">
          {dayjs(item.date).format("MMM D, YYYY")}
        </Text>
      </View>
      <View
        className={`min-w-24 flex-row items-center justify-center gap-2 rounded-full px-3 py-2 ${getStatusPillStyle(item.status)}`}
      >
        <View
          className={`h-2.5 w-2.5 rounded-full ${getStatusDotStyle(item.status)}`}
        />
        <Text className={getStatusTextClass(item.status)} variant="labelLarge">
          {item.status}
        </Text>
      </View>
    </View>
  );
};
