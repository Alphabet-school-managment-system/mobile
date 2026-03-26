import Button, { buttonMode } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useApiMutation } from "@/hooks/useApi";
import { Attendance, AttendanceStatus, Student } from "@/models";
import {
    defaultModalProps,
    ModalContext,
    ModalPropsType,
} from "@/store/modalContext";
import dayjs from "dayjs";
import { useContext, useEffect } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

type AttendanceStudentData = {
  info: Student;
  attendance?: Attendance | null;
};

type StatusFormProps = {
  student?: AttendanceStudentData;
  selectedDate: Date;
  academicYearId?: string | null;
  attendanceQueryKey: string[];
  onSaved: () => void;
};

const statusOptions: AttendanceStatus[] = ["Present", "Absent", "Excused"];

export default function StatusForm({
  student,
  selectedDate,
  academicYearId,
  attendanceQueryKey,
  onSaved,
}: StatusFormProps) {
  const { colors } = useTheme();
  const { setModalProps } = useContext(ModalContext);
  const activeAttendance = student?.attendance ?? null;

  const { mutate: createAttendance, isPending: creatingAttendance } =
    useApiMutation(attendanceQueryKey, "attendance");

  const { mutate: updateAttendance, isPending: updatingAttendance } =
    useApiMutation(
      attendanceQueryKey,
      activeAttendance?.id
        ? `attendance/${activeAttendance.id}/update`
        : "attendance/invalid",
      "PUT",
    );

  const { mutate: deleteAttendance, isPending: deletingAttendance } =
    useApiMutation(
      attendanceQueryKey,
      activeAttendance?.id
        ? `attendance/${activeAttendance.id}/delete`
        : "attendance/invalid",
      "DELETE",
    );

  const isSaving =
    creatingAttendance || updatingAttendance || deletingAttendance;

  useEffect(() => {
    setModalProps((prev: ModalPropsType) => ({
      ...defaultModalProps,
      loadingText: "Saving ...",
      show: isSaving,
    }));
  }, [isSaving, deletingAttendance, updatingAttendance, setModalProps]);

  const hideLoadingModal = () => {
    setModalProps((prev: ModalPropsType) => ({
      ...prev,
      show: false,
    }));
  };

  const handleSaveStatus = (status: AttendanceStatus) => {
    if (!student?.info.id || !selectedDate) return;
    if (!academicYearId) return;

    const payload = {
      academic_year_id: academicYearId,
      student_id: student.info.id,
      date: dayjs(selectedDate).format("YYYY-MM-DD"),
      status,
    };

    const onSuccess = () => {
      hideLoadingModal();
      onSaved();
    };

    const isPresent = status === "Present";
    const hasAttendance = Boolean(activeAttendance?.id);

    if (!hasAttendance) {
      if (isPresent) {
        onSuccess();
        return;
      }

      createAttendance(
        { body: payload },
        {
          onSuccess,
          onError: hideLoadingModal,
        },
      );
      return;
    }

    if (isPresent) {
      deleteAttendance(
        { body: {} },
        {
          onSuccess,
          onError: hideLoadingModal,
        },
      );
      return;
    }

    updateAttendance(
      { body: payload },
      {
        onSuccess,
        onError: hideLoadingModal,
      },
    );
  };

  if (!student) {
    return (
      <View className="py-4">
        <Text className="text-gray-500" variant="bodyMedium">
          Select a student to update attendance.
        </Text>
      </View>
    );
  }

  const showPresent = Boolean(student?.attendance?.id);

  const visibleOptions = showPresent
    ? statusOptions
    : statusOptions.filter((status) => status !== "Present");

  return (
    <View>
      {visibleOptions.map((status) => {
        const isCurrent = student?.attendance?.status === status;
        return (
          <Button
            key={status}
            title={status}
            onPress={() => handleSaveStatus(status)}
            disabled={
              creatingAttendance || updatingAttendance || deletingAttendance
            }
            mode={isCurrent ? buttonMode.CONTAINED : buttonMode.OUTLINE}
            tranparent={!isCurrent}
            textColor={
              isCurrent
                ? ""
                : status === "Absent"
                  ? colors.error
                  : colors.primary
            }
            style={{
              marginBottom: 12,
              borderColor: isCurrent
                ? ""
                : status === "Absent"
                  ? colors.error
                  : colors.primary,
              borderWidth: isCurrent ? 0 : 1,
            }}
          />
        );
      })}
    </View>
  );
}
