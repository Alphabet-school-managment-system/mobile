import GradeSectionPicker, {
  CustomDropDown,
  useGradeSectionPicker,
} from "@/components/common/GradeSectionPicker";
import Button from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { TextInput } from "@/components/ui/textinput";
import { useApiMutation } from "@/hooks/useApi";
import { useUtil } from "@/hooks/useUtil";
import { LearningMaterial } from "@/models";
import {
  LearningMaterialFileTypeEnum,
  LearningMaterialSourceEnum,
  LearningMaterialStatusEnum,
} from "@/models/enums";
import {
  LearningMaterialForm,
  learningMaterialSchema,
  LearningMaterialUpdateForm,
  learningMaterialUpdateSchema,
} from "@/schema";
import { IdsContext } from "@/store/providers/IdContext";
import {
  defaultModalProps,
  ModalContext,
  ModalPropsType,
} from "@/store/providers/ModalContext";
import { UserContext } from "@/store/providers/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import * as DocumentPicker from "expo-document-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import { Icon, SegmentedButtons } from "react-native-paper";
import Toast from "react-native-toast-message";

const MAX_LEARNING_MATERIAL_MATERIAL_SIZE_BYTES = 200 * 1024 * 1024;

export default function Index() {
  const { userData } = useContext(UserContext);
  const { Ids } = useContext(IdsContext);
  const { setModalProps } = useContext(ModalContext);
  const { subjects } = useUtil();
  const { material: stringifiedData } = useLocalSearchParams<{
    material: string;
  }>();
  const [selectedSubject, setSelectedSubject] = useState<
    { label: string; value: string | number } | undefined
  >();
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<
    LearningMaterialFileTypeEnum | undefined
  >(LearningMaterialFileTypeEnum.DOCUMENT);

  const parsedData = useMemo<LearningMaterial | undefined>(() => {
    if (!stringifiedData) return undefined;

    try {
      return JSON.parse(stringifiedData) as LearningMaterial;
    } catch {
      return undefined;
    }
  }, [stringifiedData]);

  const isEditing = Boolean(parsedData?.id);

  const form = useForm<LearningMaterialForm | LearningMaterialUpdateForm>({
    resolver: zodResolver(
      isEditing ? learningMaterialUpdateSchema : learningMaterialSchema,
    ),
    defaultValues: {
      title: "",
      description: undefined,
      material_url: undefined,
      material_file: undefined,
      material_type: LearningMaterialFileTypeEnum.DOCUMENT,
      material_size: 0,
      uploaded_by: userData?.id ?? "",
      branch_id: Ids?.branchId ?? "",
      school_id: Ids?.schoolId ?? "",
      grade: undefined,
      subject: undefined,
      material_source: LearningMaterialSourceEnum.LINK,
      status: LearningMaterialStatusEnum.DRAFT,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setError,
    clearErrors,
    setValue,
  } = form;
  const materialSource = watch("material_source");

  const {
    selectedGradeSec,
    setSelectedGradeSec,
    gradeMenuItems,
    selectedGradeDisplay,
    showGradeSectionLoading,
  } = useGradeSectionPicker({
    userId: userData?.id,
    academicYearId: Ids?.academicYearId,
    onGradeChange: (value?: string) => {
      setValue("grade", value ?? undefined, { shouldValidate: true });
    },
  });

  useEffect(() => {
    if (!parsedData) {
      return;
    }

    const nextMaterialSource =
      parsedData.material_source ?? LearningMaterialSourceEnum.LINK;
    const nextMaterialType =
      parsedData.material_type ?? LearningMaterialFileTypeEnum.DOCUMENT;

    reset({
      title: parsedData.title ?? "",
      description: parsedData.description ?? undefined,
      material_url: parsedData.material_url ?? undefined,
      material_file: undefined,
      material_type: nextMaterialType as LearningMaterialFileTypeEnum,
      material_size: parsedData.material_size ?? 0,
      uploaded_by: parsedData.uploaded_by ?? userData?.id ?? "",
      branch_id: parsedData.branch_id ?? Ids?.branchId ?? "",
      school_id: Ids?.schoolId ?? "",
      grade: parsedData.grade ?? undefined,
      subject: parsedData.subject ?? undefined,
      material_source: nextMaterialSource as LearningMaterialSourceEnum,
      status: (parsedData.status ??
        LearningMaterialStatusEnum.DRAFT) as LearningMaterialStatusEnum,
    });

    setSelectedDocument(null);
    setSelectedFileType(nextMaterialType as LearningMaterialFileTypeEnum);
    setSelectedGradeSec(
      parsedData.grade
        ? { grade: String(parsedData.grade), section: undefined }
        : undefined,
    );

    const matchedSubject = subjects.find(
      (item) => String(item.value) === String(parsedData.subject),
    );
    setSelectedSubject(matchedSubject);
  }, [
    Ids?.branchId,
    Ids?.schoolId,
    parsedData,
    reset,
    setSelectedGradeSec,
    subjects,
    userData?.id,
  ]);

  const { mutate: createMaterial, isPending: isCreating } = useApiMutation(
    ["learning-material"],
    "learning-material",
    "POST",
  );

  const { mutate: updateMaterial, isPending: isUpdating } = useApiMutation(
    ["learning-material"],
    parsedData?.id
      ? `learning-material/${parsedData.id}/update`
      : "learning-material",
    "PUT",
  );

  const isPending = isCreating || isUpdating;

  const formatMaterialTypeLabel = (
    type: LearningMaterialFileTypeEnum | undefined,
  ): string => {
    switch (type) {
      case LearningMaterialFileTypeEnum.DOCUMENT:
        return "Document (PDF only)";
      case LearningMaterialFileTypeEnum.VIDEO:
        return "Video (MP4 only)";
      default:
        return typeof type === "string" ? type : "";
    }
  };

  useEffect(() => {
    setModalProps((prev: ModalPropsType) => ({
      ...defaultModalProps,
      show: isPending,
      loadingText: isEditing ? "Updating..." : "Creating...",
    }));
  }, [isEditing, isPending, setModalProps]);

  const materialTypeMenuItems = useMemo(
    () =>
      Object.values(LearningMaterialFileTypeEnum).map((value) => ({
        title: formatMaterialTypeLabel(value),
        leadingIcon: selectedFileType === value ? "check" : "file-outline",
        onPress: () => {
          setSelectedFileType(value);
          setValue("material_type", value, { shouldValidate: true });
        },
      })),
    [selectedFileType, setValue],
  );

  const handleMaterialSourceChange = (value: LearningMaterialSourceEnum) => {
    setValue("material_source", value, { shouldValidate: true });
    setSelectedDocument(null);
    setValue("material_file", undefined as any, { shouldValidate: true });
    clearErrors("material_file");

    if (value === LearningMaterialSourceEnum.LINK) {
      setValue("material_url", "", { shouldValidate: true });
      setValue("material_size", 0, { shouldValidate: true });
      clearErrors("material_url");
      clearErrors("material_size");
      return;
    }

    setValue("material_url", "", { shouldValidate: true });
    setValue("material_size", 0, { shouldValidate: true });
    clearErrors("material_url");
    clearErrors("material_size");
  };

  const subjectMenuItems = useMemo(
    () =>
      subjects.map((item) => ({
        title: item.label,
        leadingIcon:
          String(selectedSubject?.value) === String(item.value)
            ? "check"
            : "book-outline",
        onPress: () => {
          setSelectedSubject(item);
          setValue("subject", String(item.value), { shouldValidate: true });
        },
      })),
    [subjects, selectedSubject, setValue],
  );

  const pickDocument = async (
    onChange: (value: string) => void,
    setFileSize: (value: number) => void,
  ) => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
      type: ["application/pdf", "video/mp4"],
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const asset = result.assets[0];

    if (
      typeof asset.size === "number" &&
      asset.size > MAX_LEARNING_MATERIAL_MATERIAL_SIZE_BYTES
    ) {
      setSelectedDocument(null);
      setValue("material_file", undefined as any, { shouldValidate: true });
      setValue("material_url", "", { shouldValidate: true });
      setValue("material_size", 0, { shouldValidate: true });
      setError("material_size", {
        type: "manual",
        message: "Material size must be 200 MB or less.",
      });
      return;
    }

    clearErrors("material_size");
    clearErrors("material_file");
    setSelectedDocument(asset);
    setValue("material_file", asset as any, { shouldValidate: true });
    setValue("material_size", asset.size ?? 0, { shouldValidate: true });
    onChange("");
    setFileSize(asset.size ?? 0);
  };

  const handleFormSubmit = async (
    values: LearningMaterialForm | LearningMaterialUpdateForm,
  ) => {
    if (!Ids?.branchId || !userData?.id) {
      Toast.show({
        type: "info",
        text1: "Missing info",
        text2: "Branch and user are required to upload materials.",
      });
      return;
    }

    try {
      const appendTextField = (
        formData: FormData,
        key: string,
        value: unknown,
      ) => {
        if (value === undefined || value === null || value === "") return;
        formData.append(key, String(value));
      };

      const shouldUploadFile =
        values.material_source === LearningMaterialSourceEnum.FILE &&
        (!isEditing || !!selectedDocument || !!values.material_file?.uri);

      const payload = shouldUploadFile
        ? await (async () => {
            const file = values.material_file as
              | DocumentPicker.DocumentPickerAsset
              | null
              | undefined;

            if (!file?.uri) {
              Toast.show({
                type: "error",
                text1: "Missing file",
                text2: "Select a PDF or MP4 file before uploading.",
              });
              return null;
            }

            const formData = new FormData();

            const fallbackFileName = `learning-material.${
              values.material_type === LearningMaterialFileTypeEnum.DOCUMENT
                ? "pdf"
                : "mp4"
            }`;

            appendTextField(formData, "title", values.title);
            appendTextField(formData, "description", values.description);
            appendTextField(formData, "material_type", values.material_type);
            appendTextField(formData, "material_size", values.material_size);
            appendTextField(formData, "uploaded_by", userData.id);
            appendTextField(formData, "branch_id", Ids.branchId);
            appendTextField(formData, "school_id", Ids.schoolId);
            appendTextField(formData, "grade", values.grade);
            appendTextField(formData, "subject", values.subject);
            appendTextField(
              formData,
              "material_source",
              values.material_source,
            );
            appendTextField(
              formData,
              "status",
              values.status ?? LearningMaterialStatusEnum.DRAFT,
            );

            formData.append("material_file", {
              uri: file.uri,
              name: file.name ?? fallbackFileName,
              type:
                file.mimeType ??
                (values.material_type === LearningMaterialFileTypeEnum.DOCUMENT
                  ? "application/pdf"
                  : "video/mp4"),
            } as any);

            return formData;
          })()
        : {
            ...values,
            uploaded_by: userData.id,
            branch_id: Ids.branchId,
            material_size: Number(values.material_size),
            status: values.status ?? LearningMaterialStatusEnum.DRAFT,
          };

      if (!payload) return;

      const mutate = isEditing ? updateMaterial : createMaterial;

      mutate(
        { body: payload },
        {
          onSuccess: () => {
            Toast.show({
              type: "success",
              text1: "Success",
              text2: isEditing
                ? "Learning material updated successfully."
                : "Learning material saved successfully.",
            });
            router.navigate("/(app)/(learning-material)/my-upload");
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormInvalid = (formErrors: typeof errors) => {
    console.log(
      "%capp/(app)/(learning-material)/newUpload.tsx form errors",
      "color: #d97706;",
      formErrors,
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 p-5"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <TextInput
              keyboardType="default"
              placeholder="Material title"
              left={undefined}
              value={field.value ?? ""}
              onChangeText={field.onChange}
              error={!!errors.title}
              errorMessage={errors?.title?.message}
              label="Title"
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <TextInput
              keyboardType="default"
              placeholder="Short description"
              left={undefined}
              value={field.value ?? ""}
              onChangeText={field.onChange}
              error={!!errors.description}
              errorMessage={errors?.description?.message}
              label="Description (optional)"
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

        <Controller
          control={control}
          name="material_source"
          render={({ field }) => (
            <SegmentedButtons
              value={field.value ?? ""}
              onValueChange={(value) =>
                handleMaterialSourceChange(value as LearningMaterialSourceEnum)
              }
              buttons={[
                {
                  value: LearningMaterialSourceEnum.LINK,
                  label: "Link",
                  icon: "link",
                },
                {
                  value: LearningMaterialSourceEnum.FILE,
                  label: "Uploaded file",
                  icon: "file-upload",
                },
              ]}
              style={{ marginBottom: 16 }}
            />
          )}
        />

        <Controller
          control={control}
          name="material_url"
          render={({ field }) =>
            materialSource === LearningMaterialSourceEnum.LINK ? (
              <TextInput
                keyboardType="default"
                placeholder="https://example.com/material.document"
                left={() => <Icon source="link" size={20} />}
                value={field.value}
                onChangeText={field.onChange}
                error={!!errors.material_url}
                errorMessage={errors?.material_url?.message}
                label="Material URL"
              />
            ) : (
              <View className="mt-2 mb-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                <Button
                  title={
                    selectedDocument || isEditing
                      ? "Replace file"
                      : "Choose file"
                  }
                  onPress={() =>
                    void pickDocument(field.onChange, (value) =>
                      setValue("material_size", value, {
                        shouldValidate: true,
                      }),
                    )
                  }
                  style={{ marginBottom: 12 }}
                  contentStyle={{ height: 46 }}
                />
                <View className="gap-1">
                  <Text variant="bodyMedium" disableTranslation>
                    {selectedDocument?.name ??
                      (isEditing &&
                      parsedData?.material_source ===
                        LearningMaterialSourceEnum.FILE
                        ? "Current uploaded file"
                        : "No file selected")}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: "#6b7280" }}
                    disableTranslation
                  >
                    {selectedDocument
                      ? `${Math.max((selectedDocument.size ?? 0) / 1024, 0).toFixed(1)} KB`
                      : isEditing &&
                          parsedData?.material_source ===
                            LearningMaterialSourceEnum.FILE &&
                          typeof parsedData.material_size === "number"
                        ? `${Math.max((parsedData.material_size ?? 0) / 1024, 0).toFixed(1)} KB`
                        : "Pick a file from your device to attach it here."}
                  </Text>
                </View>
                {isEditing &&
                parsedData?.material_source ===
                  LearningMaterialSourceEnum.FILE ? (
                  <Text
                    className="mt-2 text-gray-500"
                    variant="bodySmall"
                    disableTranslation
                  >
                    Select a new file to replace the existing upload.
                  </Text>
                ) : null}
                {errors.material_size?.message ? (
                  <Text
                    variant="bodySmall"
                    style={{ color: "#dc2626", marginTop: 8 }}
                    disableTranslation
                  >
                    {errors.material_size.message}
                  </Text>
                ) : null}
                {errors.material_file?.message ? (
                  <Text
                    variant="bodySmall"
                    style={{ color: "#dc2626", marginTop: 8 }}
                    disableTranslation
                  >
                    {errors.material_file
                      ? String(
                          errors.material_file.message ?? errors.material_file,
                        )
                      : null}
                  </Text>
                ) : null}
              </View>
            )
          }
        />

        <CustomDropDown
          label="Material Type"
          value={formatMaterialTypeLabel(selectedFileType)}
          placeholder="Select material type"
          menuItems={materialTypeMenuItems}
          headerTitle="Material Type"
          errorMessage={errors.material_type?.message}
          showLabel={true}
        />

        <GradeSectionPicker
          selected={{
            grade: {
              value: selectedGradeSec?.grade ?? "",
              label: selectedGradeDisplay ?? "",
            },
            section: "",
          }}
          MenuItems={{ grade: gradeMenuItems, section: [] }}
          ErrorMessage={{ grade: errors.grade?.message ?? "", section: "" }}
          label={{
            grade: { value: "Grade", show: true },
            section: { value: "Section", show: false },
          }}
          loading={{ grade: showGradeSectionLoading, section: false }}
          hideSection={true}
        />

        <CustomDropDown
          label="Subject"
          value={selectedSubject?.label}
          placeholder="Select subject"
          menuItems={subjectMenuItems}
          headerTitle="Subject"
          errorMessage={errors.subject?.message}
          showLabel={true}
          menuSearch={{ placeholder: "Search subject" }}
        />

        <Button
          title={isEditing ? "Update" : "Upload"}
          onPress={handleSubmit(handleFormSubmit, handleFormInvalid)}
          style={{ marginBottom: 0 }}
        />
      </ScrollView>
    </View>
  );
}
