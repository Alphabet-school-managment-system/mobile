import { Text } from "@/components/ui/text";
import { StudentSubject, SubjectTabKey } from "@/features/student-home/types";
import { useUtil } from "@/hooks/useUtil";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import StudentSubjectAssessmentDetail from "./StudentSubjectAssessmentDetail";

const emptyMessageMap: Record<SubjectTabKey, { title: string; body: string }> =
  {
    assessment: {
      title: "No assessments yet",
      body: "Assessments for this subject will appear here once they are published.",
    },
    assignment: {
      title: "No assignments yet",
      body: "Assignments for this subject will appear here once they are published.",
    },
  };

export default function StudentSubjectDetailScreen() {
  const { subjects } = useUtil();
  const { subject: stringifiedSubject } = useLocalSearchParams<{
    subject?: string;
  }>();
  const [activeTab, setActiveTab] = useState<SubjectTabKey>("assessment");

  const subject = useMemo<StudentSubject | undefined>(() => {
    const rawSubject = Array.isArray(stringifiedSubject)
      ? stringifiedSubject[0]
      : stringifiedSubject;

    if (!rawSubject) return undefined;

    return subjects.find((item) => item.value === rawSubject);
  }, [subjects, stringifiedSubject]);

  if (!subject) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-center text-gray-700" variant="titleMedium">
          Subject not found
        </Text>
        <Text className="mt-2 text-center text-gray-500" variant="bodyMedium">
          We could not load the selected subject details.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex flex-1 bg-white">
      <View className="mt-4 flex-1">
        <SegmentedButtons
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as SubjectTabKey)}
          buttons={[
            { value: "assessment", label: "Assessment" },
            { value: "assignment", label: "Assignment" },
          ]}
        />

        {activeTab === "assessment" ? (
          <StudentSubjectAssessmentDetail
            subject={subject.value}
            emptyMessage={emptyMessageMap.assessment}
          />
        ) : (
          <View className="rounded-2xl items-center justify-center bg-white p-5">
            <Text className="mb-2 text-center" variant="titleMedium">
              {emptyMessageMap[activeTab].title}
            </Text>
            <Text className="text-gray-500 text-center" variant="bodyMedium">
              {emptyMessageMap[activeTab].body}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
