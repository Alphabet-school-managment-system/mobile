import FlatList from "@/components/common/flatList";
import { Text } from "@/components/ui/text";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { Assessment } from "@/models";
import { BottomSheetContext } from "@/store/providers/BottomSheetContext";
import { IdsContext } from "@/store/providers/IdContext";
import { UserContext } from "@/store/providers/UserContext";
import dayjs from "dayjs";
import { useContext, useMemo } from "react";
import { View } from "react-native";
type StudentAssessment = Assessment & {
  mark: {
    score: number;
  };
};

type StudentSubjectAssessmentDetailProps = {
  subject: string;
  emptyMessage?: {
    title: string;
    body: string;
  };
};

function AssessmentCard({ item }: { item: StudentAssessment }) {
  const { openBottomSheet } = useContext(BottomSheetContext);

  const openDetailSheet = (note: string) => {
    openBottomSheet({
      title: (
        <Text
          variant="titleMedium"
          className="text-center"
        >{`Assessment Detail`}</Text>
      ),
      fitToContents: true,
      contentKey: `assessment-note|${item.id}`,
      children: (
        <View className="px-4 pb-4 pt-2">
          {item.note ? (
            <View className="rounded-lg border border-slate-200 bg-slate-50 p-4 gap-2">
              <View className="gap-1">
                <Text
                  className="text-slate-500 uppercase tracking-wide font-extrabold"
                  variant="labelLarge"
                >
                  Note
                </Text>
                <Text className="text-slate-800 leading-6" variant="bodyMedium">
                  {item.note}
                </Text>
              </View>

              <View className="h-px bg-slate-200" />

              <View className="flex-row items-center justify-between">
                <Text
                  className="text-slate-500 font-extrabold"
                  variant="labelLarge"
                >
                  Max Score
                </Text>
                <Text
                  className="font-semibold text-slate-900"
                  variant="bodyMedium"
                >
                  {item.max_score}
                </Text>
              </View>
            </View>
          ) : (
            <View className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
              <Text className="text-center text-slate-500" variant="bodyMedium">
                No note available for this assessment.
              </Text>
            </View>
          )}
        </View>
      ),
    });
  };

  return (
    <TouchableOpacity
      onPress={() => (item?.note ? openDetailSheet(item.note ?? "") : null)}
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
        <View className="flex-1">
          <Text className="text-slate-900" variant="titleMedium">
            {item.title}
          </Text>
          <Text className="text-slate-500" variant="bodyMedium">
            {dayjs(item.created_at).format("MMM D, YYYY")}
          </Text>
        </View>
      </View>

      <View className="items-end gap-1">
        {item?.mark?.score ? (
          <>
            <Text className="font-bold text-slate-900" variant="titleSmall">
              {`${item.mark?.score ?? "ungraded"} / ${item.max_score}`}
            </Text>
            <Text className="text-slate-500" variant="bodySmall">
              Score
            </Text>
          </>
        ) : (
          <Text className="text-slate-500 italic font-bold" variant="bodySmall">
            UN-GRADED
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function StudentSubjectAssessmentDetail({
  subject,
  emptyMessage,
}: StudentSubjectAssessmentDetailProps) {
  const { userData } = useContext(UserContext);
  const { Ids } = useContext(IdsContext);

  const endpoint = useMemo(() => {
    if (!userData?.id || !userData?.grade || !Ids?.academicYearId || !subject) {
      return "";
    }

    const params = new URLSearchParams();
    params.set("grade", String(userData.grade));
    if (userData.section) {
      params.set("section", userData.section);
    }
    params.set("academic_year_id", Ids.academicYearId);
    params.set("student_id", userData.id);
    params.set("subject", subject);

    return `mark/my-assessments?${params.toString()}`;
  }, [
    Ids?.academicYearId,
    userData?.grade,
    userData?.id,
    userData?.section,
    subject,
  ]);

  return (
    <FlatList<StudentAssessment>
      apiEndpoint={endpoint}
      enableFetch={Boolean(endpoint)}
      emptyDataTitle={
        <View className="rounded-2xl bg-white items-center text-center justify-center">
          <Text className="mb-2" variant="titleMedium">
            {emptyMessage?.title}
          </Text>
          <Text className="text-gray-500" variant="bodyMedium">
            {emptyMessage?.body}
          </Text>
        </View>
      }
      header={<View />}
      renderItem={({ item }) => <AssessmentCard item={item} />}
    />
  );
}
