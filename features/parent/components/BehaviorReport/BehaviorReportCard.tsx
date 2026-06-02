import { Text } from "@/components/ui/text";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { BottomSheetContext } from "@/store/providers/BottomSheetContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import dayjs from "dayjs";
import { useContext } from "react";
import { View } from "react-native";
import { BEHAVIOR_THEME, BehaviorReportRecord } from "../../types";

export const BehaviorReportCard = ({
  item,
}: {
  item: BehaviorReportRecord;
}) => {
  const { openBottomSheet } = useContext(BottomSheetContext);
  const isPositive = item.type === "Positive";
  const theme = isPositive ? BEHAVIOR_THEME.Positive : BEHAVIOR_THEME.Negative;
  const teacherName =
    `${item.teacher.first_name ?? ""} ${item.teacher.middle_name ?? ""}`.trim();

  const openDescriptionSheet = () => {
    openBottomSheet({
      title: (
        <Text variant="titleMedium" className="text-center">
          {`Behavior Detail - ${dayjs(item.date).format("MMM D, YYYY")}`}
        </Text>
      ),
      fitToContents: true,
      contentKey: `behavior-description|${item.id}`,
      children: (
        <View className="rounded-2xl border border-slate-200 bg-white p-4">
          <View className="mb-4 flex items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="text-slate-500" variant="bodySmall">
                Behavior reported by
              </Text>
              <Text className="mt-1 text-slate-900" variant="titleMedium">
                {teacherName || "a teacher"}
              </Text>
            </View>
            <View className="rounded-full py-2">
              <Text
                className="font-semibold"
                variant="labelMedium"
                style={{ color: theme.text }}
              >
                Report details
              </Text>
              <Text className="leading-6 text-slate-700" variant="bodyMedium">
                {item.description?.trim() || "No description provided."}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {}}
            className="mt-4 flex-row items-center justify-center gap-2 rounded-full px-4 py-3"
            style={{ backgroundColor: theme.accent }}
          >
            <Ionicons name="finger-print-outline" size={18} color="#fff" />
            <Text className="text-white" variant="labelMedium">
              Tap to contact teacher.
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });
  };

  return (
    <TouchableOpacity
      onPress={openDescriptionSheet}
      className="mb-3 overflow-hidden rounded-lg border bg-white px-4 py-4 shadow-sm"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.border,
      }}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-2">
          <Text className="text-slate-600" variant="bodySmall">
            {dayjs(item.date).format("MMM D, YYYY")}
          </Text>
          <View className="flex-row items-center gap-3">
            <View className="flex-1">
              <Text className="text-slate-900" variant="titleMedium">
                {teacherName || "Teacher"}
              </Text>
            </View>
          </View>
        </View>
        <View
          className="rounded-full px-3 py-3"
          style={{ backgroundColor: theme.accent }}
        >
          <Text className="text-white" variant="labelSmall">
            {item.type}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
