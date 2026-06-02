import { Text } from "@/components/ui/text";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { View } from "react-native";
import { List } from "react-native-paper";
import { SubjectAssessmentGroup } from "../../types";
import { AssessmentRow } from "./AssessmentRow";

export const SubjectGroupCard = ({
  item,
  expanded,
  onToggle,
}: {
  item: SubjectAssessmentGroup;
  expanded: boolean;
  onToggle: () => void;
}) => {
  return (
    <List.Accordion
      expanded={expanded}
      onPress={onToggle}
      right={() => (
        <Ionicons
          name={
            expanded
              ? "chevron-down-circle-outline"
              : "chevron-up-circle-outline"
          }
          size={25}
          color="#000"
          style={{ transform: [{ rotate: "180deg" }] }}
        />
      )}
      title={
        <View className="flex-1 flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-100">
            {item.icon ?? (
              <MaterialCommunityIcons
                name="book-open-page-variant"
                size={20}
                color="#334155"
              />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-slate-900" variant="titleMedium">
              {item.label}
            </Text>
            <Text className="mt-1 text-slate-500" variant="bodySmall">
              {`${item.assessments.length} assessment${item.assessments.length === 1 ? "" : "s"}`}
            </Text>
          </View>
        </View>
      }
      titleNumberOfLines={1}
      style={{
        backgroundColor: "#fff",
        marginHorizontal: 0,
        marginBottom: 10,
        overflow: "hidden",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "gray",
      }}
    >
      {item.assessments.map((assessment) => (
        <AssessmentRow key={assessment.id} item={assessment} />
      ))}
      {item.assessments.length === 0 ? (
        <View className="p-0">
          <View className=" bg-white p-4 mb-2">
            <Text className="text-center text-slate-500" variant="bodyMedium">
              No assessments have been published for this subject yet.
            </Text>
          </View>
        </View>
      ) : null}
    </List.Accordion>
  );
};
