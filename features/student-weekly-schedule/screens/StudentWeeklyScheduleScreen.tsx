import { BottomSheetContext } from "@/store/providers/BottomSheetContext";
import { IdsContext } from "@/store/providers/IdContext";
import { UserContext } from "@/store/providers/UserContext";
import { useContext } from "react";
import { FlatList, View } from "react-native";

import { Text } from "@/components/ui/text";
import { ScheduleDaysRow } from "../components/ScheduleDaysRow";
import { StudentScheduleBottomSheetContent } from "../components/StudentScheduleBottomSheetContent";
import { StudentWeeklyScheduleListHeader } from "../components/StudentWeeklyScheduleListHeader";
import { useStudentWeeklySchedule } from "../hooks/useStudentWeeklySchedule";
import { DAYS, WeekDay } from "../types";

export default function StudentWeeklyScheduleScreen() {
  const { getDayTitle } = useStudentWeeklySchedule();
  const { userData } = useContext(UserContext);
  const { Ids } = useContext(IdsContext);
  const { openBottomSheet } = useContext(BottomSheetContext);

  const openScheduleSheet = (day: WeekDay) => {
    openBottomSheet({
      title: (
        <Text
          variant="titleMedium"
          className="text-center"
        >{`${getDayTitle(day)} Schedule`}</Text>
      ),
      fitToContents: true,
      contentKey: `${day}|${userData?.grade ?? ""}|${userData?.section ?? ""}|${Ids?.academicYearId ?? ""}`,
      children: <StudentScheduleBottomSheetContent day={day} />,
    });
  };

  return (
    <View className="flex-1 bg-slate-50">
      <FlatList
        data={DAYS}
        keyExtractor={(item) => item.value}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 32,
          gap: 12,
        }}
        ListHeaderComponent={<StudentWeeklyScheduleListHeader />}
        renderItem={({ item }) => {
          return (
            <ScheduleDaysRow
              item={item}
              onClick={() => openScheduleSheet(item.value)}
            />
          );
        }}
      />
    </View>
  );
}
