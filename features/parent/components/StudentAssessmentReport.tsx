import FlatList from "@/components/common/flatList";
import { Text } from "@/components/ui/text";
import { useStudentHome } from "@/features/student-home/hooks/useStudentHome";
import { StudentSubject } from "@/features/student-home/types";
import { useApiQuery } from "@/hooks/useApi";
import { useUtil } from "@/hooks/useUtil";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import groupBy from "lodash/groupBy";
import { useMemo, useState } from "react";
import { View } from "react-native";
import {
    MyAssessment,
    StudentAssessmentReportProps,
    SubjectAssessmentGroup,
} from "../types";
import { SubjectGroupCard } from "./AssessmentReport/SubjectGroupCard";

export const StudentAssessmentReport = ({
  studentId,
  grade,
  section,
  stream,
  academicYearId,
}: StudentAssessmentReportProps) => {
  const { get_speciality_label } = useUtil();
  const [expandedSubject, setExpandedSubject] = useState<string | undefined>();
  const { subjects: studentSubjects } = useStudentHome({
    grade,
    stream,
  });

  const hasRequiredContext =
    Boolean(studentId) &&
    grade !== undefined &&
    grade !== null &&
    grade !== "" &&
    Boolean(academicYearId);

  const endpoint = useMemo(() => {
    if (!hasRequiredContext) return "";

    const params = new URLSearchParams();
    params.set("student_id", studentId ?? "");
    params.set("grade", String(grade ?? ""));

    if (section) {
      params.set("section", section);
    }

    if (academicYearId) {
      params.set("academic_year_id", academicYearId);
    }

    return `mark/my-assessments?${params.toString()}`;
  }, [academicYearId, grade, hasRequiredContext, section, studentId]);

  const { data: myAssessments = [] } = useApiQuery<MyAssessment[]>(
    [
      "mark",
      "my-assessments",
      studentId ?? "",
      String(grade ?? ""),
      section ?? "",
      academicYearId ?? "",
    ],
    endpoint,
    Boolean(endpoint),
  );

  const groupedAssessments = useMemo<SubjectAssessmentGroup[]>(() => {
    const assessmentsBySubject = groupBy(
      myAssessments,
      (assessment) => assessment.subject,
    );

    const baseGroups = studentSubjects.map((subject: StudentSubject) => ({
      label: subject.label,
      value: subject.value,
      icon: subject.icon,
      assessments: assessmentsBySubject[subject.value] ?? [],
    }));

    const extraGroups = Object.entries(assessmentsBySubject)
      .filter(
        ([subjectValue]) =>
          !studentSubjects.some((item) => item.value === subjectValue),
      )
      .map(([subjectValue, assessments]) => ({
        label:
          get_speciality_label(subjectValue) === "Unknown"
            ? subjectValue
            : get_speciality_label(subjectValue),
        value: subjectValue,
        icon: (
          <MaterialCommunityIcons
            name="book-open-page-variant"
            size={20}
            color="#334155"
          />
        ),
        assessments,
      }));

    return [...baseGroups, ...extraGroups].sort((left, right) =>
      left.label.localeCompare(right.label),
    );
  }, [get_speciality_label, myAssessments, studentSubjects]);

  return (
    <FlatList<SubjectAssessmentGroup>
      enableFetch={false}
      data={groupedAssessments}
      header={
        <View className="rounded-lg border p-4 bg-white mb-4">
          <Text
            className="mt-1 text-gray-900 text-center font-bold"
            variant="titleSmall"
          >
            Assessments are grouped by subject for easier review.
          </Text>
        </View>
      }
      emptyDataTitle={
        <View className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-8">
          <Text className="text-center text-slate-900" variant="titleMedium">
            No subjects available
          </Text>
          <Text
            className="mt-2 text-center text-slate-500"
            variant="bodyMedium"
          >
            We could not determine the student&apos;s subject list for this
            enrollment.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <SubjectGroupCard
          item={item}
          expanded={expandedSubject === item.value}
          onToggle={() =>
            setExpandedSubject((current) =>
              current === item.value ? undefined : item.value,
            )
          }
        />
      )}
      alternateRowStyle={false}
      containerClassName="bg-slate-100 px-0 pt-0"
      contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 24 }}
      keyExtractor={(item) => item.value}
    />
  );
};
