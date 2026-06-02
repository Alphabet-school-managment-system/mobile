import { Text } from "@/components/ui/text";
import { StudentAssessmentReport } from "@/features/parent/components/StudentAssessmentReport";
import { StudentBehaviorReport } from "@/features/parent/components/StudentBehaviorReport";
import { StudentWeeklyAttendance } from "@/features/parent/components/StudentWeeklyAttendance";
import { StudentWithEnrollment } from "@/features/parent/types";
import { BottomSheetContext } from "@/store/providers/BottomSheetContext";
import { IdsContext } from "@/store/providers/IdContext";
import { UtilContext } from "@/store/providers/UtilContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { Tabs, TabScreen, TabsProvider } from "react-native-paper-tabs";

export default function Index() {
  const { Ids } = useContext(IdsContext);
  const { Util, setUtil } = useContext(UtilContext);

  const { openBottomSheet, closeBottomSheet } = useContext(BottomSheetContext);

  const { student: stringifiedStudent } = useLocalSearchParams<{
    student?: string;
  }>();

  const parsedStudent = useMemo<StudentWithEnrollment | undefined>(() => {
    if (!stringifiedStudent) return undefined;

    try {
      return JSON.parse(stringifiedStudent) as StudentWithEnrollment;
    } catch {
      return undefined;
    }
  }, [stringifiedStudent]);

  const activeEnrollment = parsedStudent?.enrollment;

  console.log(
    "%cfeatures/parent/screens/ParentStudentDetailScreen.tsx:37 activeEnrollment",
    "color: #007acc;",
    activeEnrollment,
  );

  const openDescriptionSheet = () => {
    openBottomSheet({
      title: (
        <Text variant="titleMedium" className="text-center">
          Choose an action
        </Text>
      ),
      fitToContents: true,
      contentKey: `${activeEnrollment?.id}`,
      children: (
        <View className=" border-slate-200 bg-white p-4 items-center">
          <TouchableOpacity
            onPress={() => {
              closeBottomSheet();
              router.push({
                pathname: "/(app)/(leave-request)",
                params: {
                  params: JSON.stringify({
                    ...activeEnrollment?.student,
                    id: activeEnrollment?.id,
                    showHeader: true,
                  }),
                },
              });
            }}
            className="flex-row gap-2 bg-slate-400 rounded-lg px-4 py-3 w-full justify-center items-center"
            style={{
              backgroundColor: "#e5e7eb",
            }}
          >
            <Ionicons name="calendar-outline" size={16} color="#4b5563" />
            <Text variant="bodyMedium" className="text-slate-900">
              Request a leave of absence for this student
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });
  };

  useEffect(() => {
    if (activeEnrollment) {
      setUtil({
        ...Util,
        onHeaderRightPress: openDescriptionSheet,
      });
    }
  }, [activeEnrollment]);

  return (
    <View className="flex-1 bg-slate-100">
      <TabsProvider defaultIndex={0}>
        <Tabs
          showTextLabel
          tabHeaderStyle={{ backgroundColor: "#fff" }}
          tabLabelStyle={{ textTransform: "none" }}
        >
          <TabScreen label="Weekly Attendance">
            <StudentWeeklyAttendance student_id={activeEnrollment?.id ?? ""} />
          </TabScreen>

          <TabScreen label="Assessment">
            <StudentAssessmentReport
              studentId={activeEnrollment?.id ?? ""}
              grade={activeEnrollment?.grade}
              section={activeEnrollment?.section}
              stream={activeEnrollment?.stream}
              academicYearId={Ids?.academicYearId}
            />
          </TabScreen>

          <TabScreen label="Behaviour">
            <StudentBehaviorReport
              studentId={activeEnrollment?.id}
              academicYearId={Ids?.academicYearId}
            />
          </TabScreen>
        </Tabs>
      </TabsProvider>
    </View>
  );
}
