import { Text } from "@/components/ui/text";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { StatusIndicator } from "@/constants/status";
import dayjs from "dayjs";
import { router } from "expo-router";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { LeaveRequestRowProps } from "../types";

function LeaveRequestRow({ item }: LeaveRequestRowProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      className="rounded-lg py-3 px-4 mb-3 "
      style={{
        borderColor: colors.primary,
        borderWidth: 1,
        backgroundColor: colors.surface,
      }}
      onPress={() => {
        router.push({
          pathname: "/(app)/(leave-request)/[id]",
          params: { id: item.id, leaveRequest: JSON.stringify(item) },
        });
      }}
    >
      <View className="flex flex-row items-center justify-between mb-2">
        <Text className="text-gray-600" variant="titleMedium">
          {`${dayjs(item.start_date).format("MMM D, YYYY")} - ${item.end_date ? dayjs(item.end_date).format("MMM D, YYYY") : "Same Date"}`}
        </Text>

        <StatusIndicator status={item.status} />
      </View>
    </TouchableOpacity>
  );
}

export default LeaveRequestRow;
