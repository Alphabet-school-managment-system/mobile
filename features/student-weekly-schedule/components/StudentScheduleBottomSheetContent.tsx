import { Index as Loading } from "@/components/common/loading";
import { Index as Avatar } from "@/components/ui/Avatar";
import { Text } from "@/components/ui/text";
import { useApiQuery } from "@/hooks/useApi";
import { IdsContext } from "@/store/providers/IdContext";
import { UserContext } from "@/store/providers/UserContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useContext, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { useStudentWeeklySchedule } from "../hooks/useStudentWeeklySchedule";
import { TimetableRecord, WeekDay } from "../types";

export const StudentScheduleBottomSheetContent = ({
  day,
}: {
  day: WeekDay;
}) => {
  const { getDayTitle, getPeriodOrder, getTeacherName } =
    useStudentWeeklySchedule();
  const { userData } = useContext(UserContext);
  const { Ids } = useContext(IdsContext);
  const scheduleEndpoint = useMemo(() => {
    if (
      !Ids?.academicYearId ||
      userData?.grade === undefined ||
      userData?.grade === null ||
      !userData?.section
    ) {
      return "";
    }

    const params = new URLSearchParams();
    params.set("academic_year_id", Ids.academicYearId);
    params.set("grade", String(userData.grade));
    params.set("section", userData.section);
    params.set("day", day);
    params.set("limit", "7");

    return `timetable/?${params.toString()}`;
  }, [Ids?.academicYearId, day, userData?.grade, userData?.section]);

  const {
    data: schedules = [],
    isLoading,
    isFetching,
  } = useApiQuery<TimetableRecord[]>(
    [
      scheduleEndpoint,
      day,
      String(userData?.grade ?? ""),
      userData?.section ?? "",
      Ids?.academicYearId ?? "",
    ],
    scheduleEndpoint,
    Boolean(scheduleEndpoint),
  );

  const orderedSchedules = useMemo(
    () =>
      [...schedules].sort(
        (left, right) =>
          getPeriodOrder(left.period) - getPeriodOrder(right.period),
      ),
    [schedules],
  );

  if (
    userData?.grade === undefined ||
    userData?.grade === null ||
    !userData?.section ||
    !Ids?.academicYearId
  ) {
    return (
      <View className="gap-3">
        <View className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
          <Text className="text-amber-900" variant="titleMedium">
            Class details are not ready yet
          </Text>
          <Text className="mt-1 text-amber-800" variant="bodyMedium">
            We need your grade, section, and academic year before we can load
            the timetable.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 16, gap: 12 }}
      showsVerticalScrollIndicator={false}
    >
      {isLoading || isFetching ? (
        <View className="py-8">
          <Loading showLoadingSpin loadingText="Loading schedule..." />
        </View>
      ) : orderedSchedules.length ? (
        orderedSchedules.map((item) => {
          const teacherName = getTeacherName(item.teacher);
          const periodNumber = getPeriodOrder(item.period);
          const periodLabel =
            periodNumber === Number.MAX_SAFE_INTEGER
              ? `Period ${item.period}`
              : `Period #${periodNumber}`;

          return (
            <View
              key={item.id}
              className="rounded-lg bg-white border border-slate-200 p-4 gap-3"
              style={{
                shadowColor: "#0F172A",
                shadowOpacity: 0.06,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 5 },
                elevation: 3,
              }}
            >
              <View className="flex-row items-center justify-between gap-3">
                <View className="flex-1 gap-1">
                  <Text
                    className="text-slate-500 uppercase font-bold"
                    variant="labelLarge"
                  >
                    {periodLabel}
                  </Text>
                  <Text
                    className="text-slate-900 uppercase"
                    variant="titleMedium"
                  >
                    {item.subject}
                  </Text>
                </View>

                <View className="flex-row justify-center items-center gap-2">
                  <Avatar title={teacherName || "Teacher not assigned"} />
                </View>
              </View>

              {item.note ? (
                <View className="flex-row items-start gap-2">
                  <MaterialCommunityIcons
                    name="note-text-outline"
                    size={18}
                    color="#64748B"
                  />
                  <Text className="flex-1 text-slate-500" variant="bodySmall">
                    {item.note}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        })
      ) : (
        <View className="rounded-2xl bg-slate-50 border border-dashed border-slate-300 p-5 items-center gap-2">
          <MaterialCommunityIcons
            name="calendar-remove-outline"
            size={30}
            color="#64748B"
          />
          <Text className="text-slate-900 text-center" variant="titleMedium">
            No classes scheduled
          </Text>
          <Text className="text-slate-600 text-center" variant="bodyMedium">
            {`There is no timetable saved for ${getDayTitle(day)}.`}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};
