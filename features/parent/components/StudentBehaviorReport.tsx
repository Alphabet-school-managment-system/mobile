import FlatList from "@/components/common/flatList";
import { Text } from "@/components/ui/text";
import { useMemo } from "react";
import { View } from "react-native";
import { BehaviorReportRecord, StudentBehaviorReportProps } from "../types";
import { BehaviorReportCard } from "./BehaviorReport/BehaviorReportCard";

export const StudentBehaviorReport = ({
  studentId,
  academicYearId,
}: StudentBehaviorReportProps) => {
  const endpoint = useMemo(() => {
    if (!studentId || !academicYearId) return "";

    const params = new URLSearchParams();
    params.set("student_id", studentId);
    params.set("academic_year_id", academicYearId);
    params.set("__and", "student_id,academic_year_id");

    return `behavior/search/?${params.toString()}`;
  }, [academicYearId, studentId]);

  return (
    <FlatList<BehaviorReportRecord>
      apiEndpoint={endpoint}
      enableFetch={true}
      header={
        <View className="mb-4 rounded-lg border bg-white p-4">
          <Text
            className="text-center font-bold text-gray-900"
            variant="titleSmall"
          >
            {`Only behavior reports approved by school admin are shown here. Tap any report to read the full description.`}
          </Text>
        </View>
      }
      emptyDataTitle={
        <View className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-8">
          <Text className="text-center text-slate-900" variant="titleMedium">
            No behavior reports found
          </Text>
          <Text
            className="mt-2 text-center text-slate-500"
            variant="bodyMedium"
          >
            We could not find any behavior reports for this student yet.
          </Text>
        </View>
      }
      renderItem={({ item }) => <BehaviorReportCard item={item} />}
      alternateRowStyle={false}
      containerClassName="bg-slate-100"
      contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 24 }}
      keyExtractor={(item) => item.id}
    />
  );
};

export default StudentBehaviorReport;
