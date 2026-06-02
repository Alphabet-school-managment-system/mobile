import { Text } from "@/components/ui/text";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { BottomSheetContext } from "@/store/providers/BottomSheetContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import dayjs from "dayjs";
import { useContext } from "react";
import { View } from "react-native";
import { useParent } from "../../hooks/useParent";
import { MyAssessment } from "../../types";

export const AssessmentRow = ({ item }: { item: MyAssessment }) => {
  const { openBottomSheet } = useContext(BottomSheetContext);
  const { formatScore } = useParent();

  const openDetailSheet = () => {
    openBottomSheet({
      title: (
        <Text variant="titleMedium" className="text-center">
          Assessment Note
        </Text>
      ),
      fitToContents: true,
      contentKey: `assessment-note|${item.id}`,
      children: (
        <View className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <Text className=" leading-6 text-slate-800" variant="bodyMedium">
            {item.note}
          </Text>
        </View>
      ),
    });
  };

  return (
    <View className="mb-4 w-full">
      <View className="w-full rounded-md border border-gray-500 bg-gray-50 p-4">
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <Text className="text-slate-900" variant="titleMedium">
              {item.title}
            </Text>
            <Text className="mt-1 text-slate-500" variant="bodySmall">
              {item.created_at
                ? dayjs(item.created_at).format("MMM D, YYYY")
                : "No date available"}
            </Text>
          </View>

          <View className="rounded-2xl bg-slate-100 px-3 py-2 flex-col justify-center items-center">
            {formatScore(item)}
          </View>
        </View>

        <View className="mt-3 flex-row items-center justify-between gap-3">
          <View className="flex-1">
            {item.note ? (
              <TouchableOpacity
                onPress={openDetailSheet}
                className="flex-row items-center gap-2 rounded-full bg-slate-900 p-2"
              >
                <Ionicons name="document-text-outline" size={18} color="#000" />
                <Text className="text-slate-700" variant="labelMedium">
                  Tap to view the assessment note.
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};
