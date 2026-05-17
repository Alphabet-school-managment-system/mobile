import { Text } from "@/components/ui/text";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { UtilContext } from "@/store/providers/UtilContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs";
import { useContext, useMemo } from "react";
import { View } from "react-native";
import { dayByIndex, WeekDay } from "../types";

export const ScheduleDaysRow = ({
  item,
  onClick,
}: {
  item: any;
  onClick: () => void;
}) => {
  const { Util } = useContext(UtilContext);

  const currentDay = useMemo<WeekDay>(() => {
    const reference = Util?.serverDate
      ? dayjs(Util.serverDate, "YYYY-MM-DD")
      : dayjs();
    return dayByIndex[reference.day()] ?? "Mon";
  }, [Util?.serverDate]);

  const isToday = item.value === currentDay;

  return (
    <TouchableOpacity
      onPress={() => {
        onClick();
      }}
      className="bg-white border border-slate-200 rounded-lg p-4 flex-row items-center justify-between"
      style={[
        {
          shadowColor: "#0F172A",
          shadowOpacity: 0.05,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        },
        !isToday
          ? {
              opacity: 0.88,
              transform: [{ scale: 0.99 }],
            }
          : null,
      ]}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <View
          className={`h-12 w-12 rounded-lg items-center justify-center ${isToday ? "bg-indigo-600" : "bg-slate-100"}`}
        >
          <MaterialCommunityIcons
            name="calendar-today"
            size={22}
            color={"#334155"}
          />
        </View>
        <View className="flex-1">
          <Text className="text-slate-900" variant="titleMedium">
            {item.title}
          </Text>
          <Text className="text-slate-500" variant="bodyMedium">
            {"Tap to view schedule"}
          </Text>
        </View>
      </View>

      <View className="items-end gap-1">
        {isToday ? (
          <View className="rounded-full bg-indigo-50 px-3 py-1">
            <Text className="text-indigo-700" variant="labelMedium">
              Today
            </Text>
          </View>
        ) : null}
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={"#475569"}
        />
      </View>
    </TouchableOpacity>
  );
};
