import { Text } from "@/components/ui/text";
import { BottomSheetContext } from "@/store/providers/BottomSheetContext";
import { IdsContext } from "@/store/providers/IdContext";
import { UserContext } from "@/store/providers/UserContext";
import { useContext } from "react";
import { FlatList, View } from "react-native";
import { ScheduleDaysRow } from "../components/ScheduleDaysRow";
import { TeacherScheduleBottomSheetContent } from "../components/TeacherScheduleBottomSheetContent";
import { WeeklyScheduleListHeader } from "../components/WeeklyScheduleListHeader";
import { useWeeklySchedule } from "../hooks/useWeeklySchedule";
import { DAYS, WeekDay } from "../types";

export default function TeacherWeeklyScheduleScreen() {
  const { getDayTitle } = useWeeklySchedule();
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
      children: <TeacherScheduleBottomSheetContent day={day} />,
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
        ListHeaderComponent={
          <WeeklyScheduleListHeader showClassDetail={false} />
        }
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
