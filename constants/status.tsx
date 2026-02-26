import { Text } from "@/components/ui/text";
import { View } from "react-native";

export const statusStyles: Record<
  string,
  { bgColor: string; textColor: string }
> = {
  approved: { bgColor: "#dcfce7", textColor: "#15803d" },
  rejected: { bgColor: "#fee2e2", textColor: "#b91c1c" },
  pending: { bgColor: "#fef9c3", textColor: "#a16207" },
};

export const StatusIndicator = ({ status }: { status?: string }) => {
  const statusKey = (status || "Pending").toLowerCase();
  const style = statusStyles[statusKey] || statusStyles.pending;

  return (
    <View className="flex-row items-center">
      <View
        className="px-2 py-1 rounded-full"
        style={{ backgroundColor: style.bgColor }}
      >
        <Text
          className="text-xs font-semibold uppercase"
          style={{ color: style.textColor }}
        >
          {status || "Pending"}
        </Text>
      </View>
    </View>
  );
};
