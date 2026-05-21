import { Text } from "@/components/ui/text";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { StudentSubject } from "@/features/student-home/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { View } from "react-native";

type SubjectRowProps = {
  item: StudentSubject;
  onPress: () => void;
};

export default function SubjectRow({ item, onPress }: SubjectRowProps) {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      className="bg-white border border-slate-200 rounded-lg p-4 flex-row items-center justify-between mb-4"
      style={[
        {
          shadowColor: "#0F172A",
          shadowOpacity: 0.05,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        },
      ]}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <View className={`h-12 w-12 rounded-lg items-center justify-center`}>
          {item?.icon}
        </View>
        <View className="flex-1">
          <Text className="text-slate-900" variant="titleMedium">
            {item.label}
          </Text>
          <Text className="text-slate-500" variant="bodyMedium">
            {"Tap to view assesment and assignment"}
          </Text>
        </View>
      </View>

      <View className="items-end gap-1">
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={"#475569"}
        />
      </View>
    </TouchableOpacity>
  );
}
