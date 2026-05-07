import {
  CustomDropDown,
  useGradeSectionPicker,
} from "@/components/common/GradeSectionPicker";
import { Index as Loading } from "@/components/common/loading";
import Button from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { DatePicker, TextInput } from "@/components/ui/textinput";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { useApiMutation, useApiQuery } from "@/hooks/useApi";
import { Behavior, Student } from "@/models";
import { BottomSheetContext } from "@/store/providers/BottomSheetContext";
import { IdsContext } from "@/store/providers/IdContext";
import {
  defaultModalProps,
  ModalContext,
  ModalPropsType,
} from "@/store/providers/ModalContext";
import { UserContext } from "@/store/providers/UserContext";
import { defaultUtilProps, UtilContext } from "@/store/providers/UtilContext";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import Toast from "react-native-toast-message";
import { z } from "zod";
import { BehaviorStudentData } from "../types";

const formatGradeLabel = (grade?: string | number | null) => {
  if (grade === null || typeof grade === "undefined" || grade === "") {
    return undefined;
  }

  const numericGrade =
    typeof grade === "number" ? grade : Number.parseInt(String(grade), 10);
  return Number.isNaN(numericGrade) ? String(grade) : `Grade ${numericGrade}`;
};

export default function Index() {
  const { userData } = useContext(UserContext);
  const { Ids } = useContext(IdsContext);
  const { setUtil } = useContext(UtilContext);
  const { Util } = useContext(UtilContext);
  const {
    openBottomSheet,
    closeBottomSheet,
    bottomSheetProps,
    setBottomSheetProps,
  } = useContext(BottomSheetContext);
  const { setModalProps } = useContext(ModalContext);
  const { behavior: stringifiedBehavior } = useLocalSearchParams<{
    behavior?: string;
  }>();

  const parsedBehavior = useMemo<
    | (Behavior & {
        enrollment?: {
          grade?: string;
          section?: string;
          student?: Student;
        };
      })
    | undefined
  >(() => {
    if (!stringifiedBehavior) return undefined;
    try {
      return JSON.parse(stringifiedBehavior) as Behavior & {
        enrollment?: {
          student?: Student;
        };
      };
    } catch {
      return undefined;
    }
  }, [stringifiedBehavior]);

  const isEditing = Boolean(parsedBehavior?.id);

  const behaviorDateRange = useMemo(() => {
    const startDate = Util?.acadamic_year?.start_date
      ? dayjs(Util.acadamic_year.start_date).startOf("day").toDate()
      : undefined;
    const endDate = (() => {
      const yearEnd = Util?.acadamic_year?.end_date
        ? dayjs(Util.acadamic_year.end_date).endOf("day")
        : undefined;
      const server = Util?.serverDate
        ? dayjs(Util.serverDate, "YYYY-MM-DD").endOf("day")
        : undefined;

      if (yearEnd && server) {
        return yearEnd.isBefore(server, "day")
          ? yearEnd.toDate()
          : server.toDate();
      }

      return yearEnd?.toDate() ?? server?.toDate();
    })();

    return { startDate, endDate };
  }, [
    Util?.acadamic_year?.end_date,
    Util?.acadamic_year?.start_date,
    Util?.serverDate,
  ]);

  const clampDateToRange = useMemo(
    () => (date: Date) => {
      const { startDate, endDate } = behaviorDateRange;
      let nextDate = dayjs(date);

      if (startDate && nextDate.isBefore(startDate, "day")) {
        nextDate = dayjs(startDate);
      }

      if (endDate && nextDate.isAfter(endDate, "day")) {
        nextDate = dayjs(endDate);
      }

      return nextDate.toDate();
    },
    [behaviorDateRange],
  );

  const behaviorFormSchema = useMemo(
    () =>
      z
        .object({
          academic_year_id: z.string().uuid("Academic year is required"),
          student_id: z.string().uuid("Select a student"),
          teacher_id: z.string().uuid("Select a teacher"),
          date: z.date(),
          description: z.string().max(500).nullable().optional(),
          type: z.enum(["Positive", "Negative"]),
          branchId: z.string().uuid().nullable().optional(),
        })
        .superRefine((values, ctx) => {
          const { startDate, endDate } = behaviorDateRange;

          if (startDate && dayjs(values.date).isBefore(startDate, "day")) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["date"],
              message: "Date must be within the academic year range",
            });
          }

          if (endDate && dayjs(values.date).isAfter(endDate, "day")) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["date"],
              message: "Date must be within the academic year range",
            });
          }
        }),
    [behaviorDateRange],
  );

  type BehaviorFormValues = z.infer<typeof behaviorFormSchema>;

  const initialDate = useMemo(() => {
    const baseDate = parsedBehavior?.date
      ? new Date(parsedBehavior.date)
      : dayjs().toDate();

    return clampDateToRange(baseDate);
  }, [clampDateToRange, parsedBehavior?.date]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BehaviorFormValues>({
    resolver: zodResolver(behaviorFormSchema),
    defaultValues: {
      academic_year_id: Ids?.academicYearId || "",
      student_id: parsedBehavior?.student_id || "",
      date: initialDate,
      description: parsedBehavior?.description || "",
      type: parsedBehavior?.type || "Negative",
      branchId: Ids?.branchId || parsedBehavior?.branchId || undefined,
      teacher_id: parsedBehavior?.teacher_id || userData?.id || "",
    },
  });

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
      setValue("student_id", "", {
        shouldValidate: true,
      });
    },
    onSectionChange: () => {
      setValue("student_id", "", {
        shouldValidate: true,
      });
    },
  });

  const selectedDate = watch("date");
  const selectedStudentId = watch("student_id");

  const studentsEndpoint = useMemo(() => {
    if (!selectedGradeSec?.grade || !selectedGradeSec?.section) return "";
    if (!Ids?.academicYearId) return "";

    const params = new URLSearchParams();
    params.set("grade", selectedGradeSec.grade);
    params.set("section", selectedGradeSec.section);
    params.set("academic_year_id", Ids.academicYearId);

    return `enrollment/search/?${params.toString()}`;
  }, [Ids?.academicYearId, selectedGradeSec?.grade, selectedGradeSec?.section]);

  const { data: studentsData = [], isLoading: loadingStudents } = useApiQuery<
    BehaviorStudentData[]
  >([studentsEndpoint], studentsEndpoint, Boolean(studentsEndpoint));

  const { mutate, isPending } = useApiMutation(
    ["behavior"],
    isEditing && parsedBehavior?.id
      ? `behavior/${parsedBehavior.id}/update`
      : "behavior",
    isEditing ? "PUT" : "POST",
  );

  useEffect(() => {
    if (!Ids?.academicYearId) return;

    setValue("academic_year_id", Ids.academicYearId, {
      shouldValidate: true,
    });
  }, [Ids?.academicYearId, setValue]);

  useEffect(() => {
    if (!Ids?.branchId) return;

    setValue("branchId", Ids.branchId, {
      shouldValidate: false,
    });
  }, [Ids?.branchId, setValue]);

  useEffect(() => {
    if (!parsedBehavior) return;

    reset({
      academic_year_id:
        parsedBehavior.academic_year_id || Ids?.academicYearId || "",
      student_id: parsedBehavior.student_id || "",
      date: parsedBehavior.date
        ? clampDateToRange(new Date(parsedBehavior.date))
        : initialDate,
      description: parsedBehavior.description || "",
      type: parsedBehavior.type || "Negative",
      branchId: parsedBehavior.branchId || Ids?.branchId || undefined,
      teacher_id: parsedBehavior.teacher_id || "",
    });
  }, [
    Ids?.academicYearId,
    Ids?.branchId,
    clampDateToRange,
    parsedBehavior,
    reset,
    initialDate,
  ]);

  useEffect(() => {
    if (!behaviorDateRange.startDate && !behaviorDateRange.endDate) return;

    const nextDate = clampDateToRange(selectedDate);
    if (dayjs(nextDate).isSame(selectedDate, "day")) return;

    setValue("date", nextDate, {
      shouldValidate: true,
    });
  }, [behaviorDateRange, clampDateToRange, selectedDate, setValue]);

  useEffect(() => {
    setUtil({
      routeTitle: isEditing ? "Update Behavior Report" : "New Behavior Report",
    });
    return () => {
      setUtil(defaultUtilProps);
    };
  }, [isEditing, setUtil]);

  useEffect(() => {
    setModalProps((prev: ModalPropsType) => ({
      ...defaultModalProps,
      show: isPending,
      loadingText: "Saving...",
    }));
  }, [isPending, isEditing, setModalProps]);

  useEffect(() => {
    return () => {
      setModalProps((prev: ModalPropsType) => ({
        ...defaultModalProps,
        show: false,
      }));
    };
  }, [setModalProps]);

  const selectedStudentLabel = useMemo(() => {
    const matchedStudent = studentsData.find(
      (item) => item?.id === selectedStudentId,
    );
    const parsedStudent = parsedBehavior?.enrollment?.student;

    const formatStudentLabel = (student?: Student) => {
      if (!student) return undefined;

      const fullName = [
        student.first_name,
        student.middle_name,
        student.last_name,
      ]
        .filter((part) => Boolean(part && String(part).trim()))
        .join(" ")
        .trim();

      const reg =
        student?.student_registration_number !== undefined &&
        student?.student_registration_number !== null
          ? ` #${student.student_registration_number}`
          : "";

      return `${fullName}${reg}`.trim();
    };

    if (matchedStudent?.student) {
      return formatStudentLabel(matchedStudent.student);
    }

    if (parsedStudent) {
      return formatStudentLabel(parsedStudent);
    }

    if (selectedStudentId) {
      return `Selected student (${selectedStudentId.slice(0, 8)})`;
    }

    return undefined;
  }, [parsedBehavior?.enrollment?.student, selectedStudentId, studentsData]);

  const selectedGradeSectionLabel = useMemo(() => {
    const parsedEnrollment = parsedBehavior?.enrollment;
    const gradeLabel = formatGradeLabel(parsedEnrollment?.grade);
    const sectionLabel = parsedEnrollment?.section?.trim();

    if (gradeLabel && sectionLabel) {
      return `${gradeLabel} / ${sectionLabel}`;
    }

    if (gradeLabel) {
      return gradeLabel;
    }

    if (selectedGradeSec?.grade) {
      return `${selectedGradeDisplay}${selectedGradeSec?.section ? ` / ${selectedGradeSec.section}` : ""}`;
    }

    return undefined;
  }, [
    parsedBehavior?.enrollment,
    selectedGradeDisplay,
    selectedGradeSec?.grade,
    selectedGradeSec?.section,
  ]);

  const studentMenuItems = useMemo(() => {
    if (!selectedGradeSec?.grade || !selectedGradeSec?.section) {
      return [
        {
          title: "Select grade and section first",
          leadingIcon: "information-outline",
          onPress: () => {},
        },
      ];
    }

    if (loadingStudents) {
      return [
        {
          title: "Loading students...",
          leadingIcon: "progress-clock",
          onPress: () => {},
        },
      ];
    }

    if (!studentsData.length) {
      return [
        {
          title: "No students found",
          leadingIcon: "alert-circle-outline",
          onPress: () => {},
        },
      ];
    }

    return studentsData.map((item) => {
      const reg =
        item?.student?.student_registration_number !== undefined
          ? ` #${item?.student?.student_registration_number}`
          : "";

      return {
        title: `${item?.student?.first_name} ${item?.student?.middle_name} ${item?.student?.last_name}${reg}`,
        leadingIcon:
          selectedStudentId === item?.student?.id
            ? "check-circle-outline"
            : "account",
        onPress: () => {
          setValue("student_id", item?.id, {
            shouldValidate: true,
          });
        },
      };
    });
  }, [
    loadingStudents,
    selectedGradeSec?.grade,
    selectedGradeSec?.section,
    selectedStudentId,
    setValue,
    studentsData,
  ]);

  const selectionSheetKey = useMemo(
    () =>
      `${selectedGradeSec?.grade ?? ""}|${selectedGradeSec?.section ?? ""}|${selectedStudentId ?? ""}|${loadingStudents ? "1" : "0"}`,
    [
      loadingStudents,
      selectedGradeSec?.grade,
      selectedGradeSec?.section,
      selectedStudentId,
    ],
  );

  const selectionSheetContent = useMemo(
    () => (
      <View className="gap-3">
        <Text className="text-gray-600" variant="bodyMedium">
          Choose the class, section, and student before writing the report.
        </Text>

        <View>
          <CustomDropDown
            label="Class"
            value={selectedGradeSec?.grade ? selectedGradeDisplay : undefined}
            placeholder="Select class"
            menuItems={gradeMenuItems}
            headerTitle="Select Class"
            loading={{
              value: showGradeSectionLoading,
              placeholder: "Loading classes...",
            }}
          />
        </View>

        <View>
          <CustomDropDown
            label="Section"
            value={selectedGradeSec?.section || undefined}
            placeholder="Select section"
            menuItems={sectionMenuItems}
            headerTitle="Select Section"
            loading={{
              value: showGradeSectionLoading,
              placeholder: "Loading sections...",
            }}
            disabled={!selectedGradeSec?.grade}
          />
        </View>

        <Controller
          control={control}
          name="student_id"
          render={({ field }) => (
            <View>
              <CustomDropDown
                label="Student"
                value={selectedStudentLabel || field.value || undefined}
                placeholder="Select student"
                menuItems={studentMenuItems}
                headerTitle="Select Student"
                menuSearch={{
                  enabled: true,
                  placeholder: "Search student",
                }}
                disabled={
                  !selectedGradeSec?.grade ||
                  !selectedGradeSec?.section ||
                  loadingStudents
                }
              />
              {errors.student_id?.message ? (
                <Text className="text-red-600 mt-1" variant="bodySmall">
                  {errors.student_id.message}
                </Text>
              ) : null}
            </View>
          )}
        />

        <Button
          title="Done"
          onPress={() => closeBottomSheet()}
          style={{ marginBottom: 0 }}
        />
      </View>
    ),
    [
      closeBottomSheet,
      control,
      errors.student_id?.message,
      gradeMenuItems,
      loadingStudents,
      sectionMenuItems,
      selectedGradeDisplay,
      selectedGradeSec?.grade,
      selectedGradeSec?.section,
      selectedStudentLabel,
      showGradeSectionLoading,
      studentMenuItems,
    ],
  );

  const openSelectionSheet = () => {
    openBottomSheet({
      title: "Select Class, Section & Student",
      fitToContents: true,
      children: selectionSheetContent,
      contentKey: selectionSheetKey,
    });
  };

  useEffect(() => {
    if (
      !bottomSheetProps.show ||
      bottomSheetProps.title !== "Select Class, Section & Student"
    ) {
      return;
    }

    if (bottomSheetProps.contentKey === selectionSheetKey) {
      return;
    }

    setBottomSheetProps((prev) => ({
      ...prev,
      children: selectionSheetContent,
      contentKey: selectionSheetKey,
    }));
  }, [
    bottomSheetProps.contentKey,
    bottomSheetProps.show,
    bottomSheetProps.title,
    selectionSheetContent,
    selectionSheetKey,
    setBottomSheetProps,
  ]);

  const handleFormSubmit = (values: BehaviorFormValues) => {
    const payload = {
      ...values,
      date: dayjs(values.date).format("YYYY-MM-DD"),
      description: values.description?.trim() || null,
      branchId: Ids?.branchId || values.branchId || null,
    };

    mutate(
      { body: payload },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: isEditing
              ? "Behavior report updated successfully."
              : "Behavior report saved successfully.",
          });

          setTimeout(() => {
            router.replace("/(app)/(behavior-report)/index");
          }, 100);
        },
        onError: (error: any) => {
          Toast.show({
            type: "error",
            text1: "Error",
            text2:
              error?.error?.message ?? error?.message ?? "Something went wrong",
          });
        },
      },
    );
  };

  if (!Util?.acadamic_year || !Util?.serverDate) {
    return (
      <View className="flex-1 bg-white px-5 justify-center">
        <Loading showLoadingSpin loadingText="Loading academic year..." />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-5 pt-5"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="text-gray-600 mb-5" variant="bodyMedium">
          Pick the class, choose the student, and record the report details.
        </Text>

        <TouchableOpacity
          onPress={isEditing ? undefined : openSelectionSheet}
          disabled={isEditing}
          className={`mb-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 ${isEditing ? "opacity-60" : ""}`}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-gray-700 mb-1" variant="titleMedium">
                Class, section & student
              </Text>
              <Text className="text-gray-500" variant="bodyMedium">
                {isEditing
                  ? selectedGradeSectionLabel || "Selected class and section"
                  : selectedGradeSec?.grade
                    ? `${selectedGradeDisplay}${selectedGradeSec?.section ? ` / ${selectedGradeSec.section}` : ""}`
                    : "Tap to select class and section"}
                {selectedStudentLabel ? ` • ${selectedStudentLabel}` : ""}
              </Text>
            </View>
            <View className="h-11 w-11 items-center justify-center rounded-full bg-black">
              <Ionicons name="add" size={24} color="white" />
            </View>
          </View>
        </TouchableOpacity>

        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <View className="mb-3">
              <Text className="text-base text-gray-600 font-semibold mb-2">
                Report Type
              </Text>
              <SegmentedButtons
                value={field.value ?? "Negative"}
                onValueChange={(value) =>
                  field.onChange(value as BehaviorFormValues["type"])
                }
                buttons={[
                  {
                    value: "Negative",
                    label: "Negative",
                    icon: () => (
                      <Feather name="alert-triangle" size={24} color="black" />
                    ),
                  },
                  {
                    value: "Positive",
                    label: "Positive",
                    icon: () => (
                      <Feather name="check-circle" size={24} color="black" />
                    ),
                  },
                ]}
              />
              {errors.type?.message ? (
                <Text className="text-red-600 mt-1" variant="bodySmall">
                  {errors.type.message}
                </Text>
              ) : null}
            </View>
          )}
        />

        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DatePicker
              label="Date"
              value={
                field.value
                  ? clampDateToRange(new Date(field.value))
                  : initialDate
              }
              onChange={field.onChange}
              error={!!errors.date}
              errorMessage={errors.date?.message}
              validDateRange={behaviorDateRange}
              allowEditing={false}
              inputEnabled={false}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <TextInput
              label="Description"
              placeholder="Describe the behavior report"
              value={field.value ?? ""}
              onChangeText={field.onChange}
              multiline={true}
              numberOfLines={6}
              error={!!errors.description}
              errorMessage={errors.description?.message}
              style={{
                minHeight: 150,
              }}
              outlineStyle={{
                minHeight: 150,
                height: 150,
              }}
              contentStyle={{
                minHeight: 130,
                textAlignVertical: "top",
                paddingTop: 12,
              }}
            />
          )}
        />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 pt-4 pb-6">
        <Button
          title={isEditing ? "Update Report" : "Submit Report"}
          onPress={handleSubmit(handleFormSubmit, (formErrors) => {
            if (formErrors.student_id?.message) {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: formErrors.student_id.message,
              });
            }
          })}
          loading={isPending}
        />
      </View>
    </View>
  );
}
