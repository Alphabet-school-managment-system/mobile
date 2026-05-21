import { Text } from "@/components/ui/text";
import { StudentSubject } from "@/features/student-home/types";
import { UtilContext } from "@/store/providers/UtilContext";
import { router } from "expo-router";
import { useContext } from "react";
import { ScrollView, View } from "react-native";
import SubjectRow from "../components/SubjectRow";
import { useStudentHome } from "../hooks/useStudentHome";

export default function StudentHomeScreen() {
  const { subjects } = useStudentHome();
  const { Util, setUtil } = useContext(UtilContext);

  const openSubject = (item: StudentSubject) => {
    setUtil({
      ...Util,
      routeTitle: item?.label,
    });
    router.push({
      pathname: "/(app)/(student-subject-detail)",
      params: { subject: item.value },
    });
  };

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 32,
        }}
      >
        <View className="gap-4 mb-2">
          <View className="rounded-lg bg-slate-900 px-5 py-5 gap-2">
            <Text className="text-slate-200" variant="bodyMedium">
              Tap any subject to view its details and access related resources
            </Text>
          </View>
        </View>

        {subjects.length ? (
          <View>
            {subjects.map((item) => (
              <SubjectRow
                key={item.value}
                item={item}
                onPress={() => openSubject(item)}
              />
            ))}
          </View>
        ) : (
          <View className="rounded-2xl bg-white p-5">
            <Text className="text-center text-gray-700" variant="titleMedium">
              No subjects available yet
            </Text>
            <Text
              className="mt-2 text-center text-gray-500"
              variant="bodyMedium"
            >
              We could not find subjects for your enrollment grade and stream.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
