import { CustomDropDown } from "@/components/GradeSectionPicker";
import { Index as ConfirmationModal } from "@/components/confirmationModal";
import { Index as Loading } from "@/components/loading";
import Button, { buttonMode } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { useApiMutation, useApiQuery } from "@/hooks/useApi";
import { useUtil } from "@/hooks/useUtil";
import { LearningMaterial, Teacher } from "@/models";
import {
    LearningMaterialFileTypeEnum,
    LearningMaterialStatusEnum,
} from "@/models/enums";
import { IdsContext } from "@/store/idsContext";
import {
    ConfirmationModalContext,
    defaultModalProps,
    ModalContext,
    ModalPropsType,
} from "@/store/modalContext";
import { UserContext } from "@/store/userContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useMemo, useState } from "react";
import { Linking, ScrollView, View } from "react-native";
import { useTheme } from "react-native-paper";

export type MaterialParams = {
  material?: string;
};

type LearningMaterialDetail = LearningMaterial & {
  downloadUrl?: string;
  teacher?: Teacher;
};

const statusOptions = [
  LearningMaterialStatusEnum.DRAFT,
  LearningMaterialStatusEnum.PUBLISHED,
  LearningMaterialStatusEnum.ARCHIVED,
];

const formatMaterialTypeLabel = (
  type?: LearningMaterialFileTypeEnum | string,
) => {
  switch (type) {
    case LearningMaterialFileTypeEnum.DOCUMENT:
      return "Document";
    case LearningMaterialFileTypeEnum.VIDEO:
      return "Video";
    default:
      return "-";
  }
};

const formatStatusLabel = (status?: string) => {
  switch (status) {
    case LearningMaterialStatusEnum.DRAFT:
      return "Draft";
    case LearningMaterialStatusEnum.PUBLISHED:
      return "Published";
    case LearningMaterialStatusEnum.ARCHIVED:
      return "Archived";
    default:
      return status ?? "-";
  }
};

const formatDate = (value?: string | Date | null) => {
  if (!value) return "-";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("MMM D, YYYY") : String(value);
};

export default function Index() {
  const { colors } = useTheme();
  const { Ids } = useContext(IdsContext);
  const { userData } = useContext(UserContext);
  const { setModalProps } = useContext(ModalContext);
  const { setConfirmationModalProps } = useContext(ConfirmationModalContext);
  const params = useLocalSearchParams<MaterialParams>();
  const [draftStatus, setDraftStatus] = useState<
    LearningMaterialStatusEnum | undefined
  >();
  const { getGradeLabel, get_speciality_label } = useUtil();

  const [parsedMaterial, setParsedMaterial] = useState<
    LearningMaterialDetail | undefined
  >(undefined);

  useEffect(() => {
    const parseMaterial = async () => {
      if (!params?.material) {
        setParsedMaterial(undefined);
        return;
      }
      try {
        const raw = (await JSON.parse(
          params?.material,
        )) as LearningMaterialDetail;
        setParsedMaterial(raw);
        setDraftStatus(raw.status as LearningMaterialStatusEnum);
      } catch {
        setParsedMaterial(undefined);
      }
    };
    parseMaterial();
  }, [params]);

  const materialId = useMemo(() => {
    if (parsedMaterial?.id) return String(parsedMaterial?.id);
  }, [parsedMaterial]);

  const detailEndpoint = materialId ? `learning-material/${materialId}` : "";

  const {
    data: material,
    isLoading: remoteLoading,
    refetch: refetchMaterial,
  } = useApiQuery<LearningMaterialDetail>(
    ["learning-material", materialId ?? "detail"],
    detailEndpoint,
    Boolean(detailEndpoint),
  );

  const canModify =
    !!material &&
    !!userData?.id &&
    String(material.uploaded_by) === String(userData.id);

  const downloadUrl = material?.downloadUrl ?? material?.material_url;

  const { mutate: updateMaterial, isPending: isUpdating } = useApiMutation(
    ["learning-material"],
    materialId ? `learning-material/${materialId}/patch` : "learning-material",
    "PATCH",
  );

  const { mutate: deleteMaterial, isPending: isDeleting } = useApiMutation(
    ["learning-material"],
    materialId ? `learning-material/${materialId}/delete` : "learning-material",
    "DELETE",
  );

  useEffect(() => {
    setModalProps((prev: ModalPropsType) => ({
      ...defaultModalProps,
      show: isUpdating || isDeleting,
      loadingText: isDeleting
        ? "Deleting ..."
        : isUpdating
          ? "Updating..."
          : "Loading ...",
    }));
  }, [isUpdating, isDeleting, setModalProps]);

  const handleDownload = async () => {
    if (!downloadUrl) return;
    try {
      await Linking.openURL(downloadUrl);
    } catch {}
  };

  const handleEdit = () => {
    if (!material) return;
    router.push({
      pathname: "/(app)/(learning-material)/newUpload",
      params: { material: JSON.stringify(material) },
    });
  };

  const handleDelete = () => {
    if (!material || !canModify || !materialId) return;

    setConfirmationModalProps((prev) => ({
      ...prev,
      show: true,
      title: "Confirmation",
      content: "Are you sure you want to delete this learning material?",
      okButtonText: "Yes, delete",
      cancelButtonText: "No",
      onOk: () => {
        deleteMaterial(
          { body: {} },
          {
            onSuccess: () => {
              router.replace("/(app)/(learning-material)/myUploads");
            },
            onError: () => {},
          },
        );
      },
      onCancel: () => {
        setModalProps((prev: ModalPropsType) => ({
          ...defaultModalProps,
          show: false,
        }));
      },
    }));

    setModalProps((prev: ModalPropsType) => ({
      ...defaultModalProps,
      content: <ConfirmationModal />,
      show: true,
      showLoadingSpin: false,
    }));
  };

  const applyStatusChange = (status: LearningMaterialStatusEnum) => {
    if (!material || !canModify || !materialId) return;

    setDraftStatus(status);
    setTimeout(() => {
      setModalProps((prev: ModalPropsType) => ({
        ...defaultModalProps,
        show: true,
        loadingText: "Updating...",
      }));

      updateMaterial(
        { body: { status } },
        {
          onSuccess: () => {
            setModalProps((prev: ModalPropsType) => ({
              ...defaultModalProps,
              show: false,
            }));
            void refetchMaterial();
          },
          onError: () => {
            setDraftStatus(material.status as LearningMaterialStatusEnum);
            setModalProps((prev: ModalPropsType) => ({
              ...defaultModalProps,
              show: false,
            }));
          },
        },
      );
    }, 0);
  };

  if (!materialId && !material) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-center text-gray-700" variant="titleMedium">
          Material not found
        </Text>
        <Text className="mt-2 text-center text-gray-500" variant="bodyMedium">
          We could not load the selected learning material.
        </Text>
      </View>
    );
  }

  if (remoteLoading && !material) {
    return (
      <View className="flex-1 bg-white">
        <Loading
          showLoadingSpin={true}
          loadingText="Loading material details..."
          className="flex-1"
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 16,
          paddingBottom: canModify ? 220 : 150,
        }}
      >
        <View
          className="rounded-2xl p-5"
          style={{ backgroundColor: colors.primary }}
        >
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text className="text-white/80 mb-1" variant="titleMedium">
                Title
              </Text>
              <Text className="text-white font-bold" variant="titleLarge">
                {material?.title || "-"}
              </Text>
            </View>

            <View className="h-12 w-12 items-center justify-center rounded-full bg-white">
              <MaterialCommunityIcons
                name={
                  material?.material_type === "document"
                    ? "file-pdf-box"
                    : "play-box"
                }
                size={24}
                color={colors.primary}
              />
            </View>
          </View>

          <View className="mt-5 gap-4">
            <View>
              <Text className="text-white/80 mb-1" variant="titleMedium">
                Description
              </Text>
              <Text className="text-white" variant="bodyMedium">
                {material?.description || "No description provided."}
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-2">
              <View className="rounded-full bg-white/15 px-3 py-1">
                <Text className="text-white" variant="bodySmall">
                  {formatMaterialTypeLabel(material?.material_type)}
                </Text>
              </View>
              <View className="rounded-full bg-white/15 px-3 py-1">
                <Text className="text-white" variant="bodySmall">
                  {material?.material_source === "file"
                    ? "Uploaded file"
                    : "Link"}
                </Text>
              </View>
              <View className="rounded-full bg-white/15 px-3 py-1">
                <Text className="text-white" variant="bodySmall">
                  {formatStatusLabel(material?.status)}
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap justify-between items-center gap-4">
              <View>
                <Text className="text-white/80 mb-1" variant="bodySmall">
                  Subject
                </Text>
                <Text className="text-white" variant="titleMedium">
                  {(material?.subject &&
                    get_speciality_label(material?.subject)) ||
                    "-"}
                </Text>
              </View>
              <View>
                <Text className="text-white/80 mb-1" variant="bodySmall">
                  Grade
                </Text>
                <Text className="text-white" variant="titleMedium">
                  {(material?.grade &&
                    getGradeLabel(Number(material?.grade))) ||
                    "-"}
                </Text>
              </View>
              <View>
                <Text className="text-white/80 mb-1" variant="bodySmall">
                  Uploaded
                </Text>
                <Text className="text-white" variant="titleMedium">
                  {formatDate(material?.created_at)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mt-4 rounded-2xl border border-gray-200 bg-white p-5">
          <Text
            className="text-gray-900 mb-3 font-semibold"
            variant="titleMedium"
          >
            Material Info
          </Text>

          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-500" variant="bodyMedium">
                Uploaded by
              </Text>
              <Text
                className="text-gray-900 capitalize font-bold"
                variant="bodyMedium"
              >
                {material?.teacher
                  ? `${material.teacher.first_name} ${material.teacher.middle_name}`
                  : "-"}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-500" variant="bodyMedium">
                File size
              </Text>
              <Text className="text-gray-900" variant="bodyMedium">
                {typeof (material as any)?.material_size === "number"
                  ? `${Math.max(((material as any).material_size as number) / 1024, 0).toFixed(1)} KB`
                  : typeof (material as any)?.file_size === "number"
                    ? `${Math.max(((material as any).file_size as number) / 1024, 0).toFixed(1)} KB`
                    : "-"}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-500" variant="bodyMedium">
                Updated
              </Text>
              <Text className="text-gray-900" variant="bodyMedium">
                {formatDate(material?.updated_at)}
              </Text>
            </View>

            {material?.material_source === "link" && material?.material_url ? (
              <View className="rounded-xl bg-gray-50 p-4">
                <Text className="text-gray-500 mb-2" variant="bodySmall">
                  Material URL
                </Text>
                <Text className="text-gray-900" variant="bodySmall">
                  {material.material_url}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-5 pt-4 pb-6">
        <TouchableOpacity
          onPress={handleDownload}
          disabled={!downloadUrl}
          className="mb-3 flex-row items-center justify-between rounded-xl border border-gray-300 bg-gray-50 px-4 py-4"
          style={{ opacity: downloadUrl ? 1 : 0.5 }}
        >
          <View className="flex-row items-center gap-3">
            <MaterialCommunityIcons
              name="download"
              size={22}
              color={colors.primary}
            />
            <View>
              <Text className="text-gray-600" variant="bodySmall">
                Download
              </Text>
              <Text className="text-gray-900" variant="bodyMedium">
                {downloadUrl ? "Open file" : "No downloadable file"}
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#6B7280"
          />
        </TouchableOpacity>

        {canModify ? (
          <>
            <View className="mb-3">
              <CustomDropDown
                label="Status"
                value={formatStatusLabel(
                  material?.status as LearningMaterialStatusEnum,
                )}
                placeholder="Select status"
                headerTitle="Change status"
                menuItems={statusOptions.map((status) => ({
                  title: formatStatusLabel(status),
                  leadingIcon:
                    draftStatus === status
                      ? "check"
                      : status === LearningMaterialStatusEnum.PUBLISHED
                        ? "check-circle-outline"
                        : status === LearningMaterialStatusEnum.ARCHIVED
                          ? "archive-outline"
                          : "file-document-outline",
                  onPress: () => {
                    applyStatusChange(status);
                  },
                }))}
                disabled={!materialId}
                showLabel={true}
                menuShowCloseIcon={true}
              />
            </View>

            <Button
              title="Edit"
              onPress={handleEdit}
              style={{ marginBottom: 10 }}
            />
            <Button
              title="Delete"
              onPress={handleDelete}
              mode={buttonMode.OUTLINE}
              tranparent={true}
              textColor="#dc2626"
              style={{
                marginBottom: 0,
                borderColor: "#dc2626",
                borderWidth: 1,
              }}
            />
          </>
        ) : (
          <View className="mb-1">
            <Text className="text-center text-gray-500" variant="bodyMedium">
              You can download this material, but only the uploader can edit or
              delete it.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
