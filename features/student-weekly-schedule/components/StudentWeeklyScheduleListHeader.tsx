import { Text } from "@/components/ui/text";
import { getGradeLabel } from "@/hooks/useUtil";
import { UserContext } from "@/store/providers/UserContext";
import { useContext } from "react";
import { View } from "react-native";

export const StudentWeeklyScheduleListHeader = () => {
  const { userData } = useContext(UserContext);

  return (
    <View className="gap-4 mb-2">
      <View className="rounded-lg bg-slate-900 px-5 py-5 gap-2">
        <Text className="text-slate-200" variant="bodyMedium">
          Tap any day to open that day&apos;s timetable in a bottom sheet.
        </Text>
      </View>
      <View className="rounded-lg bg-white border border-slate-200 p-4 gap-1">
        <Text className="text-slate-900" variant="titleMedium">
          Your class / section
        </Text>
        <Text className="text-slate-600" variant="bodyMedium">
          {`${getGradeLabel(Number(userData?.grade)) === "-" ? String(userData?.grade) : getGradeLabel(Number(userData?.grade))} / ${userData?.section}`}
        </Text>
      </View>
    </View>
  );
};
