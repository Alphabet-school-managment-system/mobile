import GradeSectionPicker, {
  useGradeSectionOptions,
} from "@/components/GradeSectionPicker";
import Button from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { TextInput } from "@/components/ui/textinput";
import { useApiMutation } from "@/hooks/useApi";
import { Assessment } from "@/models";
import { AssessmentForm, assessmentFormSchema } from "@/schema";
import { IdsContext } from "@/store/idsContext";
import {
  defaultModalProps,
  ModalContext,
  ModalPropsType,
} from "@/store/modalContext";
import { UserContext } from "@/store/userContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Index() {
  const apiRoute = "assessment";
  const { userData } = useContext(UserContext);
  const { Ids } = useContext(IdsContext);
  const { setModalProps } = useContext(ModalContext);
  const { assessment: stringifiedData } = useLocalSearchParams<{
    assessment?: string;
  }>();

  const parsedData = useMemo<Assessment | undefined>(
    () =>
      stringifiedData ? (JSON.parse(stringifiedData) as Assessment) : undefined,
    [stringifiedData],
  );

  const form = useForm<AssessmentForm>({
    resolver: zodResolver(assessmentFormSchema),
    defaultValues: {
      academic_year_id: Ids?.academicYearId || "",
      title: "",
      subject: userData?.subject_specialization,
      grade: undefined,
      section: undefined,
      max_score: undefined,
      note: undefined,
      teacher_id: userData?.id,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = form;

  const selectedGrade = watch("grade");
  const selectedSection = watch("section");

  const { gradeMenuItems, sectionMenuItems, selectedGradeDisplay } =
    useGradeSectionOptions({
      userId: userData?.id,
      academicYearId: Ids?.academicYearId,
      selectedGrade,
      selectedSection,
      setValue,
    });

  const { mutate, isPending } = useApiMutation(
    [apiRoute],
    parsedData?.id ? `${apiRoute}/${parsedData.id}/update` : apiRoute,
    parsedData?.id ? "PUT" : "POST",
  );

  const handleFormSubmit = async (values: AssessmentForm) => {
    const payload = {
      ...values,
      title: values.title.trim(),
      grade: values.grade.trim(),
      section: values.section?.trim() ? values.section.trim() : undefined,
      note: values.note?.trim() ? values.note.trim() : null,
      max_score: Number(values.max_score),
    };

    await mutate(
      { body: payload },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: parsedData
              ? "Assessment updated successfully"
              : "Assessment created successfully",
          });

          setTimeout(() => {
            router.replace("/(app)/(assessment)/list");
          }, 100);
        },
      },
    );
  };

  useEffect(() => {
    if (!parsedData) return;

    reset({
      academic_year_id:
        parsedData.academic_year_id || Ids?.academicYearId || "",
      title: parsedData.title || "",
      subject: parsedData.subject || "",
      grade: parsedData.grade || "",
      section: parsedData.section || undefined,
      max_score:
        parsedData.max_score === null ||
        typeof parsedData.max_score === "undefined"
          ? undefined
          : String(parsedData.max_score),
      note: parsedData.note || "",
      teacher_id: parsedData.teacher_id || userData?.id || undefined,
    });
  }, [parsedData, reset, userData?.id, Ids?.academicYearId]);

  useEffect(() => {
    if (!Ids?.academicYearId) return;
    setValue("academic_year_id", Ids.academicYearId);
  }, [Ids?.academicYearId, setValue]);

  useEffect(() => {
    setModalProps((prev: ModalPropsType) => ({
      ...defaultModalProps,
      loadingText: parsedData ? "Saving..." : "Creating...",
      show: isPending,
    }));
  }, [isPending, parsedData, setModalProps]);

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 p-5"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text className="text-base mb-4" variant="titleLarge">
          Enter Assessment Information
        </Text>

        <Text
          className="text-red-600 border-2 border-red-600 p-2 mb-4 rounded-md"
          variant="bodyMedium"
        >
          Note : The total score cannot be greater than 100.
        </Text>

        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <TextInput
              keyboardType="default"
              placeholder="e.g. Mid-exam or Quize"
              left={undefined}
              value={field.value}
              onChangeText={field.onChange}
              error={!!errors.title}
              errorMessage={errors?.title?.message}
              label="Assessment title"
            />
          )}
        />

        <GradeSectionPicker
          selectedGrade={selectedGrade}
          selectedGradeDisplay={selectedGradeDisplay}
          selectedSection={selectedSection}
          gradeMenuItems={gradeMenuItems}
          sectionMenuItems={sectionMenuItems}
          gradeErrorMessage={errors.grade?.message}
          sectionErrorMessage={errors.section?.message}
        />

        <Controller
          control={control}
          name="max_score"
          render={({ field }) => (
            <TextInput
              keyboardType="numeric"
              placeholder="Max value can't exceed 100"
              left={undefined}
              onChangeText={(value) => {
                const sanitizedValue = value.replace(/[^0-9]/g, "");
                field.onChange(
                  sanitizedValue === "" ? undefined : sanitizedValue,
                );
              }}
              value={
                field.value === null || typeof field.value === "undefined"
                  ? ""
                  : String(field.value)
              }
              error={!!errors.max_score}
              errorMessage={errors?.max_score?.message}
              label="Max Score"
            />
          )}
        />

        <Controller
          control={control}
          name="note"
          render={({ field }) => (
            <TextInput
              keyboardType="default"
              placeholder="Add a note about this assessment"
              left={undefined}
              value={field.value ?? ""}
              onChangeText={field.onChange}
              error={!!errors.note}
              errorMessage={errors?.note?.message}
              label="Note (optional)"
              multiline={true}
              numberOfLines={6}
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

        <Button
          className="mt-4"
          title={parsedData ? "Save Changes" : "Create"}
          onPress={handleSubmit(handleFormSubmit)}
        />
      </ScrollView>
    </View>
  );
}
