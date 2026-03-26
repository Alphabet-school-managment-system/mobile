import {
  CustomDropDown,
  useGradeSectionPicker,
} from "@/components/GradeSectionPicker";
import { Index as Loading } from "@/components/loading";
import Button from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useApiQuery } from "@/hooks/useApi";
import { useAssessment } from "@/hooks/useAssessment";
import { Assessment, Mark, Student } from "@/models";
import { BottomSheetContext } from "@/store/bottomSheetContext";
import { IdsContext } from "@/store/idsContext";
import { UserContext } from "@/store/userContext";
import { useContext, useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import AddMarkForm from "./markbook/addMark";
import RenderFiltersContent from "./markbook/renderFiltersContent";
import RenderStudentItem from "./markbook/renderStudentItem";

export type studentData = {
  id: string;
  student: Student;
  mark: Mark[];
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
  const [fetchStudent, setFetchStudent] = useState(false);

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
      setFetchStudent(false);
    },
    onSectionChange: () => {
      setFetchStudent(false);
    },
  });

  const {
    assessments,
    selectedAssessment,
    assessmentMenuItems,
    showAssessmentLoading,
  } = useAssessment({
    selectedGradeSec,
    onAssessmentChange: () => {
      setFetchStudent(false);
    },
  });

  const studentsEndpoint = useMemo(() => {
    if (!selectedAssessment?.id) return "";
    const params = new URLSearchParams();
    if (selectedGradeSec?.grade) params.set("grade", selectedGradeSec.grade);
    if (selectedGradeSec?.section)
      params.set("section", selectedGradeSec.section);
    params.set("assessment_id", selectedAssessment.id);
    return `mark/?${params.toString()}`;
  }, [selectedAssessment]);

  const {
    data,
    isLoading: LoadingStudents,
    isSuccess: studentsLoaded,
    isError: studentsLoadError,
  } = useApiQuery<{
    students: studentData[];
    assessment: Assessment;
  }>([studentsEndpoint], studentsEndpoint, fetchStudent);

  useEffect(() => {
    if (!fetchStudent) return;
    if (studentsLoaded || studentsLoadError) {
      setFetchStudent(false);
    }
  }, [fetchStudent, studentsLoaded, studentsLoadError]);

  const openMarkSheet = (item: studentData) => {
    if (!selectedAssessment?.id) return;

    openBottomSheet({
      title: (
        <Text
          className="text-gray-900 uppercase font-bold"
          variant="titleMedium"
        >
          {`${item?.student.first_name}, ${item?.student.middle_name}, ${item?.student.last_name}`}
        </Text>
      ),
      fitToContents: true,
      content: undefined,
      children: (
        <AddMarkForm
          data={item}
          assessmentId={selectedAssessment?.id}
          assessmentMax={selectedAssessment?.max_score}
          mark={item?.mark[0]}
          onSuccess={() => {
            closeBottomSheet();
            setFetchStudent(true);
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
          setFetchStudent(true);
          closeBottomSheet();
        }}
        disableApply={!selectedAssessment?.id}
        extraFilterOption={[
          <CustomDropDown
            label="Assessment"
            value={selectedAssessment?.title}
            placeholder="Select assessment"
            menuItems={assessmentMenuItems}
            headerTitle="Select Assessment"
            showLabel={true}
            loading={{
              value: showAssessmentLoading,
              placeholder: "Loading assessments...",
            }}
          />,
        ]}
      />
    ),
    [
      assessmentMenuItems,
      closeBottomSheet,
      gradeMenuItems,
      sectionMenuItems,
      selectedAssessment?.title,
      selectedGradeDisplay,
      selectedGradeSec?.grade,
      selectedGradeSec?.section,
      selectedGradeSec,
      selectedAssessment?.id,
    ],
  );

  const filtersKey = `${selectedGradeSec?.grade ?? ""}|${selectedGradeSec?.section ?? ""}|${selectedAssessment?.id ?? ""}|${assessments.length}|${showGradeSectionLoading ? "g1" : "g0"}|${showAssessmentLoading ? "a1" : "a0"}`;

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

  const renderStudentItem = ({ item }: { item: studentData }) => (
    <RenderStudentItem
      item={item?.student}
      onPress={() => openMarkSheet(item)}
      rightItem={
        <View className="items-end">
          <Text className="text-gray-500" variant="bodySmall">
            Score
          </Text>
          <Text className="text-gray-900" variant="titleMedium">
            {item?.mark[0].score ?? "-- Not set --"}
          </Text>
        </View>
      }
    />
  );

  useEffect(() => {
    setLoading(showAssessmentLoading || LoadingStudents);
  }, [showAssessmentLoading, LoadingStudents]);

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={data?.students ?? []}
        keyExtractor={(item, index) =>
          item?.student?.id ?? item?.id ?? String(index)
        }
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
