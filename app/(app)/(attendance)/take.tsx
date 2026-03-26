import { useGradeSectionPicker } from "@/components/GradeSectionPicker";
import { Index as Loading } from "@/components/loading";
import Button from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { DatePicker } from "@/components/ui/textinput";
import { useApiQuery } from "@/hooks/useApi";
import { AcademicYear, Attendance, AttendanceStatus, Student } from "@/models";
import { BottomSheetContext } from "@/store/bottomSheetContext";
import { IdsContext } from "@/store/idsContext";
import { UserContext } from "@/store/userContext";
import dayjs from "dayjs";
import { useContext, useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import RenderFiltersContent from "../(assessment)/markbook/renderFiltersContent";
import RenderStudentItem from "../(assessment)/markbook/renderStudentItem";
import StatusForm from "./statusForm";

type AttendanceStudentData = {
  info: Student;
  attendance?: Attendance;
};

const getStatusTextClass = (status?: AttendanceStatus) => {
  if (status === "Present") return "text-green-600";
  if (status === "Absent") return "text-red-600";
  if (status === "Excused") return "text-amber-600";
  return "text-gray-400";
};

export default function Index() {
  const { userData } = useContext(UserContext);
  const { Ids } = useContext(IdsContext);
  const {
    openBottomSheet,
    closeBottomSheet,
    bottomSheetProps,
    setBottomSheetProps,
  } = useContext(BottomSheetContext);
  const [loading, setLoading] = useState(false);
  const [fetchStudents, setFetchStudents] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeStudent, setActiveStudent] = useState<AttendanceStudentData>();

  const {
    selectedGradeSec,
    gradeMenuItems,
    sectionMenuItems,
    selectedGradeDisplay,
    showGradeSectionLoading,
  } = useGradeSectionPicker({
    userId: userData?.id,
    academicYearId: Ids?.academicYearId,
    onGradeChange: () => {
      setFetchStudents(false);
    },
    onSectionChange: () => {
      setFetchStudents(false);
    },
  });

  const attendanceEndpoint = useMemo(() => {
    if (
      !selectedGradeSec?.grade ||
      !selectedGradeSec?.section ||
      !Ids?.academicYearId
    )
      return "";
    const params = new URLSearchParams();
    params.set("grade", selectedGradeSec.grade);
    params.set("section", selectedGradeSec.section);
    params.set("academic_year_id", Ids?.academicYearId);
    params.set("date", dayjs(selectedDate).format("YYYY-MM-DD"));

    return `attendance/?${params.toString()}`;
  }, [selectedDate, selectedGradeSec?.grade, selectedGradeSec?.section]);

  const {
    data,
    isLoading: loadingStudents,
    isSuccess: studentsLoaded,
    isError: studentsLoadError,
    refetch,
  } = useApiQuery<AttendanceStudentData[]>(
    [attendanceEndpoint],
    attendanceEndpoint,
    Boolean(fetchStudents && attendanceEndpoint),
  );

  const { data: academicYear } = useApiQuery<AcademicYear>(
    ["academic-year"],
    Ids?.branchId ? `academic-year/${Ids.branchId}` : "",
    Boolean(Ids?.branchId),
  );

  const { data: serverDate } = useApiQuery<string>(
    ["server-date"],
    "util/server-date",
    true,
  );

  const attendanceQueryKey = useMemo(() => {
    return attendanceEndpoint ? [attendanceEndpoint] : [];
  }, [attendanceEndpoint]);

  useEffect(() => {
    if (!fetchStudents) return;
    if (studentsLoaded || studentsLoadError) {
      setFetchStudents(false);
    }
  }, [fetchStudents, studentsLoaded, studentsLoadError]);

  useEffect(() => {
    setLoading(loadingStudents);
  }, [loadingStudents]);

  const openStatusSheet = (item: AttendanceStudentData) => {
    setActiveStudent(item);

    openBottomSheet({
      title: (
        <Text
          className="text-gray-900 uppercase font-bold"
          variant="titleMedium"
        >
          {`${item?.info.first_name}, ${item?.info.middle_name}, ${item?.info.last_name}, @ ${dayjs(selectedDate).format("DD/MM/YYYY")}`}
        </Text>
      ),
      fitToContents: true,
      children: (
        <StatusForm
          student={item}
          selectedDate={selectedDate}
          academicYearId={Ids?.academicYearId}
          attendanceQueryKey={attendanceQueryKey}
          onSaved={() => {
            closeBottomSheet();
            setFetchStudents(true);
            if (attendanceEndpoint) {
              refetch();
            }
          }}
        />
      ),
    });
  };

  const filtersNode = useMemo(
    () => (
      <RenderFiltersContent
        selectedGradeSec={selectedGradeSec}
        selectedGradeDisplay={selectedGradeDisplay}
        gradeMenuItems={gradeMenuItems}
        sectionMenuItems={sectionMenuItems}
        loadingGrade={showGradeSectionLoading}
        loadingSection={showGradeSectionLoading}
        onApply={() => {
          setFetchStudents(true);
          closeBottomSheet();
        }}
        disableApply={
          !selectedGradeSec?.grade ||
          !selectedGradeSec?.section ||
          !selectedDate
        }
        extraFilterOption={[
          <View className="mb-3">
            <DatePicker
              label="Date"
              value={selectedDate}
              onChange={setSelectedDate}
              validDateRange={{
                startDate: academicYear?.start_date
                  ? dayjs(academicYear.start_date).toDate()
                  : undefined,
                endDate: (() => {
                  const yearEnd = academicYear?.end_date
                    ? dayjs(academicYear.end_date)
                    : undefined;
                  const server = serverDate
                    ? dayjs(serverDate, "YYYY-MM-DD")
                    : undefined;

                  if (yearEnd && server) {
                    return yearEnd.isBefore(server, "day")
                      ? yearEnd.toDate()
                      : server.toDate();
                  }

                  return yearEnd?.toDate() ?? server?.toDate();
                })(),
              }}
            />
          </View>,
        ]}
      />
    ),
    [
      academicYear?.end_date,
      academicYear?.start_date,
      closeBottomSheet,
      gradeMenuItems,
      sectionMenuItems,
      serverDate,
      selectedDate,
      selectedGradeDisplay,
      selectedGradeSec?.grade,
      selectedGradeSec?.section,
      selectedGradeSec,
      showGradeSectionLoading,
    ],
  );

  const filtersKey = `${selectedGradeSec?.grade ?? ""}|${selectedGradeSec?.section ?? ""}|${dayjs(selectedDate).format("YYYY-MM-DD")}|${showGradeSectionLoading ? "g1" : "g0"}`;

  const openFiltersSheet = () => {
    openBottomSheet({
      title: "Filters",
      fitToContents: true,
      children: filtersNode,
      contentKey: filtersKey,
    });
  };

  useEffect(() => {
    if (!bottomSheetProps.show || bottomSheetProps.title !== "Filters") return;
    if (bottomSheetProps.contentKey === filtersKey) return;
    setBottomSheetProps((prev) => ({
      ...prev,
      children: filtersNode,
      contentKey: filtersKey,
    }));
  }, [
    bottomSheetProps.show,
    bottomSheetProps.title,
    bottomSheetProps.contentKey,
    filtersKey,
    filtersNode,
    setBottomSheetProps,
  ]);

  const renderStudentItem = ({ item }: { item: AttendanceStudentData }) => {
    const currentStatus = item?.attendance?.status;

    return (
      <RenderStudentItem
        item={item.info}
        onPress={() => openStatusSheet(item)}
        rightItem={
          <View className="items-end">
            <View className="flex items-center justify-center">
              <Text className="text-gray-500" variant="bodySmall">
                Status
              </Text>
              <Text
                className={getStatusTextClass(currentStatus)}
                variant="titleMedium"
              >
                {currentStatus ?? "-- Not set --"}
              </Text>
            </View>
          </View>
        }
      />
    );
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList<AttendanceStudentData>
        data={data ?? []}
        keyExtractor={(item, index) => item?.info?.id ?? String(index)}
        renderItem={renderStudentItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        ListHeaderComponent={
          <View className="pt-5">
            <Button
              title="Filters"
              onPress={openFiltersSheet}
              icon="filter-variant"
              style={{ marginBottom: 12 }}
            />
          </View>
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">
            {!selectedGradeSec?.section ? (
              <Text className="text-gray-500" variant="bodyMedium">
                Select grade and section to load students.
              </Text>
            ) : loading ? (
              <Loading
                loadingText="Loading students..."
                showLoadingSpin={true}
              />
            ) : (
              <Text className="text-gray-500" variant="bodyMedium">
                No students found for this section.
              </Text>
            )}
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
