import { Text } from "@/components/ui/text";
import { AttendanceStatus } from "@/models";
import dayjs from "dayjs";
import { View } from "react-native";
import { MyAssessment } from "../types";

export const useParent = () => {
  const formatScore = (assessment: MyAssessment) => {
    if (
      assessment.mark?.score === null ||
      assessment.mark?.score === undefined
    ) {
      return (
        <View className="rounded-md bg-gray-200 border px-3 py-2">
          <Text className="text-gray-600" variant="labelLarge">
            UN-GRADED
          </Text>
        </View>
      );
    }

    const score = assessment.mark.score;
    const maxScore = assessment.max_score;
    const isPerfectScore = score === maxScore;
    const isBelowHalf = score < maxScore / 2;

    const scoreColor = isPerfectScore
      ? "text-emerald-600"
      : isBelowHalf
        ? "text-red-600"
        : "text-slate-900";

    return (
      <View className="items-center justify-center">
        <View className="flex-row items-baseline">
          <Text className={`font-bold ${scoreColor}`} variant="labelLarge">
            {score}
          </Text>
          <Text className="mx-1 text-slate-400" variant="labelLarge">
            /
          </Text>
          <Text className="font-semibold text-emerald-600" variant="labelLarge">
            {maxScore}
          </Text>
        </View>
        <Text className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">
          Score
        </Text>
      </View>
    );
  };

  const buildMondayWeekRange = (sourceDate?: string) => {
    const reference = sourceDate ? dayjs(sourceDate) : dayjs();
    const safeReference = reference.isValid() ? reference : dayjs();
    const weekStart = safeReference
      .startOf("day")
      .subtract((safeReference.day() + 6) % 7, "day");

    return Array.from({ length: 7 }, (_, index) => weekStart.add(index, "day"));
  };

  const getStatusPillStyle = (status?: AttendanceStatus | string) => {
    if (status === "Present") return "bg-emerald-100";
    if (status === "Absent") return "bg-red-100";
    if (status === "Excused") return "bg-amber-100";
    return "bg-gray-100";
  };

  const getStatusDotStyle = (status?: AttendanceStatus | string) => {
    if (status === "Present") return "bg-emerald-500";
    if (status === "Absent") return "bg-red-500";
    if (status === "Excused") return "bg-amber-500";
    return "bg-gray-400";
  };
  return {
    formatScore,
    buildMondayWeekRange,
    getStatusPillStyle,
    getStatusDotStyle,
  };
};
