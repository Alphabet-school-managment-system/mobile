import { Text } from "@/components/ui/text";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { Student } from "@/models";
import { ReactElement } from "react";
import { Image, View } from "react-native";
import { studentData } from "../markbook";

type RenderStudentItemProps = {
  item: studentData;
  onPress: (data: studentData) => void;
  rightItem?: ReactElement;
};

const getInitials = (student: Student) => {
  const first = student.first_name?.[0] ?? "";
  const last = student.last_name?.[0] ?? "";
  return `${first}${last}`.toUpperCase();
};

export default function RenderStudentItem({
  item,
  onPress,
  rightItem,
}: RenderStudentItemProps) {
  return (
    <TouchableOpacity
      className="mb-3 rounded-lg border border-gray-200 bg-white px-4 py-3"
      onPress={() => onPress(item)}
    >
      <View className="flex-row items-center">
        {item.student.image ? (
          <Image
            source={{ uri: item?.student.image }}
            className="h-12 w-12 rounded-full bg-gray-100"
            resizeMode="cover"
          />
        ) : (
          <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-200">
            <Text className="text-gray-700" variant="titleSmall">
              {getInitials(item?.student)}
            </Text>
          </View>
        )}

        <View className="ml-3 flex-1">
          <Text className="text-gray-900" variant="titleMedium">
            {`${item?.student.first_name}, ${item?.student.middle_name}, ${item?.student.last_name}`}
          </Text>
          <Text className="text-gray-500" variant="bodySmall">
            {`STU-${String(item?.student.student_registration_number).padStart(6, "0")}`}
          </Text>
        </View>

        {rightItem && rightItem}
      </View>
    </TouchableOpacity>
  );
}
