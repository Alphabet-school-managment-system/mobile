import { Index as Loading } from "@/components/common/loading";
import { Text } from "@/components/ui/text";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { useUtil } from "@/hooks/useUtil";
import { UtilContext } from "@/store/providers/UtilContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { useContext } from "react";
import { View } from "react-native";
import { Avatar } from "react-native-paper";
import { StudentWithEnrollment } from "../types";

const formatStudentName = (
  student?: StudentWithEnrollment["enrollment"]["student"],
) => {
  if (!student) return "Student";

  return [student.first_name, student.middle_name, student.last_name]
    .filter((part) => Boolean(part?.trim()))
    .join(" ")
    .trim();
};

const formatRegistrationNumber = (value?: number | null) => {
  if (value === undefined || value === null) return "--";
  return `STU-${String(value).padStart(6, "0")}`;
};

export const RenderEmptyState = ({ loading }: { loading: boolean }) => {
  if (loading) {
    return (
      <View className="space-y-3">
        <Loading loadingText="loading students..." showLoadingSpin />
      </View>
    );
  }

  return (
    <View className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-10">
      <Text
        className="text-center text-gray-500"
        disableTranslation
        variant="bodyLarge"
      >
        No students are linked to this parent yet.
      </Text>
    </View>
  );
};

export default function ParentStudentRow({
  item,
}: {
  item: StudentWithEnrollment;
}) {
  const student = item;

  const { getGradeLabel } = useUtil();
  const { Util, setUtil } = useContext(UtilContext);
  const enrollment = student?.enrollment;
  const studentInfo = enrollment?.student;
  const studentName = formatStudentName(studentInfo);
  const gradeLabel = enrollment?.grade
    ? getGradeLabel(Number(enrollment.grade) || 0)
    : "Grade --";
  const sectionLabel = enrollment?.section
    ? `Section ${enrollment.section}`
    : "No section";
  const registrationNumber = formatRegistrationNumber(
    studentInfo?.student_registration_number,
  );

  return (
    <TouchableOpacity
      onPress={() => {
        setUtil({
          ...Util,
          routeTitle: `${studentName || "Student"}`,
        });
        router.push({
          pathname: "/(app)/(parent-student-detail)",
          params: { student: JSON.stringify(student) },
        });
      }}
    >
      <View className="mb-3 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <View className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-sky-50/80" />
        <View className="p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <View className="rounded-full bg-sky-50 px-3 py-1">
              <Text
                className="text-sky-700"
                disableTranslation
                variant="labelMedium"
              >
                Parent View
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#94A3B8"
            />
          </View>

          <View className="flex-row items-center gap-4">
            <Avatar.Image
              size={64}
              source={require("@/assets/images/default-user-avatar.png")}
              style={{ backgroundColor: "#F1F5F9" }}
            />

            <View className="flex-1">
              <Text
                className="text-gray-500"
                disableTranslation
                variant="labelMedium"
              >
                Student
              </Text>
              <Text
                className="mt-1 text-gray-900"
                disableTranslation
                variant="titleMedium"
              >
                {studentName}
              </Text>
              <Text
                className="mt-1 text-gray-500"
                disableTranslation
                variant="bodySmall"
              >
                {gradeLabel} {sectionLabel}
              </Text>
            </View>
          </View>

          <View className="mt-4 flex-row flex-wrap gap-2">
            <View className="rounded-full bg-gray-100 px-3 py-2">
              <Text
                className="text-gray-700"
                disableTranslation
                variant="labelSmall"
              >
                {registrationNumber}
              </Text>
            </View>
            <View className="rounded-full bg-emerald-50 px-3 py-2">
              <Text
                className="text-emerald-700"
                disableTranslation
                variant="labelSmall"
              >
                Linked child
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
