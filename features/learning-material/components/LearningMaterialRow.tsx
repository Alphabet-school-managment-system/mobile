import { Text } from "@/components/ui/text";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs";
import { router } from "expo-router";
import { View } from "react-native";
import { LearningMaterialRowProps } from "../types";

export function Index({ item, colors }: LearningMaterialRowProps) {
  return (
    <TouchableOpacity
      className="mb-3 rounded-xl p-4 flex-row items-start justify-between"
      style={{ backgroundColor: colors.primary }}
      onPress={() => {
        router.push({
          pathname: "/(app)/(learning-material)/[id]",
          params: { material: JSON.stringify(item) },
        });
      }}
    >
      <View className="flex-1 gap-2">
        <Text className="text-white font-semibold" variant="titleMedium">
          {item.title}
        </Text>
        <Text className="text-white uppercase" variant="titleMedium">
          {item.subject}
        </Text>
        <Text className="text-white" variant="bodySmall">
          {item.created_at ? dayjs(item.created_at).format("MMM D, YYYY") : ""}
        </Text>
      </View>

      <View className="flex items-center justify-center self-center">
        <View className="items-center justify-center rounded-full bg-white p-2 h-11 w-11">
          <MaterialCommunityIcons
            name={
              item.material_type === "document" ? "file-pdf-box" : "play-box"
            }
            size={22}
            color={colors.primary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
