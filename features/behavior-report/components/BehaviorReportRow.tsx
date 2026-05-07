import { Text } from "@/components/ui/text";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs";
import { router } from "expo-router";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { BehaviorReportItemProps } from "../types";

function Index({ item }: BehaviorReportItemProps) {
  const { colors } = useTheme();
  const isPositive = item.type === "Positive";
  const reportDate = dayjs(item.date).format("MMM D, YYYY");

  return (
    <TouchableOpacity
      className="mb-3 rounded-lg px-4 py-4"
      style={{
        backgroundColor: isPositive ? "#ECFDF5" : "#FEF2F2",
        borderColor: isPositive ? "#A7F3D0" : "#FECACA",
        borderWidth: 1,
      }}
      onPress={() => {
        router.push({
          pathname: "/(app)/(behavior-report)/[id]",
          params: { behavior: JSON.stringify(item) },
        });
      }}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <View className="mb-2 flex-row items-center gap-2">
            <View
              className="rounded-full px-3 py-1"
              style={{
                backgroundColor: isPositive ? "#10B981" : colors.error,
              }}
            >
              <Text className="text-white" variant="labelSmall">
                {item.type}
              </Text>
            </View>
            <Text className="text-gray-500" variant="bodySmall">
              {reportDate}
            </Text>
          </View>

          <Text className="text-gray-900" variant="titleMedium">
            {item.enrollment?.student
              ? `${item.enrollment.student.first_name} ${item.enrollment.student.middle_name} ${item.enrollment.student.last_name}`
              : ""}
          </Text>

          <Text className="mt-1 text-gray-700" variant="bodyMedium">
            {item.description?.trim() || "No description provided."}
          </Text>
        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={isPositive ? "#059669" : "#DC2626"}
        />
      </View>
    </TouchableOpacity>
  );
}

export { Index };
