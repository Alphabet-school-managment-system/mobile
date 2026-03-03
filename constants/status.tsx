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
        className="rounded-lg"
        style={{ backgroundColor: style.bgColor, padding: 6 }}
      >
        <Text
          className="text-xs font-semibold w-full"
          style={{ color: style.textColor, textTransform: "uppercase" }}
        >
          {status || "Pending"}
        </Text>
      </View>
    </View>
  );
};
