import { Index as ConfirmationModal } from "@/components/common/confirmationModal";
import { Index as Loading } from "@/components/common/loading";
import Button, { buttonMode } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useApiMutation } from "@/hooks/useApi";
import { getGradeLabel } from "@/hooks/useUtil";
import { Assessment } from "@/models";
import {
  ConfirmationModalContext,
  defaultModalProps,
  ModalContext,
  ModalPropsType,
} from "@/store/providers/ModalContext";
import { UserContext } from "@/store/providers/UserContext";
import { UtilContext } from "@/store/providers/UtilContext";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function Index() {
  const apiRoute = "assessment";
  const { colors } = useTheme();
  const { Util, setUtil } = useContext(UtilContext);
  const { userData } = useContext(UserContext);
  const { setModalProps } = useContext(ModalContext);
  const { setConfirmationModalProps } = useContext(ConfirmationModalContext);
  const { assessment: stringifiedData } = useLocalSearchParams<{
    assessment?: string;
  }>();
  const [loading, setLoading] = useState(false);

  const parsedData = useMemo<Assessment | undefined>(() => {
    if (!stringifiedData) return undefined;
    try {
      return JSON.parse(stringifiedData) as Assessment;
    } catch {
      return undefined;
    }
  }, [stringifiedData]);

  const createdAt = parsedData?.created_at
    ? dayjs(parsedData.created_at).format("MMM D, YYYY")
    : "-";
  const gradeLabel = parsedData?.grade
    ? getGradeLabel(Number(parsedData.grade))
    : "-";
  const gradeDisplay =
    gradeLabel === "-" && parsedData?.grade
      ? String(parsedData.grade)
      : gradeLabel;

  const handleEdit = () => {
    if (!parsedData) return;
    setUtil({ ...Util, routeTitle: "Update Assessment" });
    router.push({
      pathname: "/(app)/(assessment)/new",
      params: { assessment: JSON.stringify(parsedData) },
    });
  };

  const canModify =
    userData?.role === "teacher" &&
    !!userData?.id &&
    !!parsedData?.teacher_id &&
    parsedData.teacher_id === userData.id;

  const showCreatedByAdminLabel = !!parsedData && !canModify;

  const { mutate: deleteAssessment, isPending: isDeleting } = useApiMutation(
    [apiRoute],
    `${apiRoute}/${parsedData?.id}/delete`,
    "DELETE",
  );

  const handleDelete = () => {
    if (!parsedData || !canModify) return;

    setConfirmationModalProps((prev) => ({
      ...prev,
      show: true,
      title: "Confirmation",
      content: "Are you sure you want to delete this assessment?",
      okButtonText: "Yes, delete",
      cancelButtonText: "No",
      onOk: () => {
        setLoading(true);
        deleteAssessment(
          { body: {} },
          {
            onSuccess: () => {
              setLoading(false);
              router.replace("/(app)/(assessment)/index");
            },
            onError: () => {
              setLoading(false);
            },
          },
        );
      },
      onCancel: () => {
        setModalProps((prev: ModalPropsType) => ({
          ...defaultModalProps,
          content: <ConfirmationModal />,
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

  useEffect(() => {
    setModalProps((prev: ModalPropsType) => ({
      ...prev,
      show: loading,
      content: undefined,
      loadingText: loading ? "Deleting ..." : "Loading...",
    }));
  }, [loading, setModalProps]);

  return (
    <View className="flex-1 bg-white">
      {!parsedData ? (
        <Loading
          loadingText="Loading assessment details..."
          showLoadingSpin={true}
          className="mt-6"
        />
      ) : (
        <>
          <ScrollView
            className="flex-1 p-5"
            contentContainerStyle={{ paddingBottom: canModify ? 180 : 120 }}
          >
            <View
              className="rounded-xl p-5"
              style={{ backgroundColor: colors.primary }}
            >
              <View className="mb-4">
                <Text className="text-white/80 mb-1" variant="titleMedium">
                  Title
                </Text>
                <Text className="text-white font-bold" variant="titleLarge">
                  {parsedData.title}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-white/80 mb-1" variant="titleMedium">
                  Subject
                </Text>
                <Text className="text-white uppercase" variant="titleMedium">
                  {parsedData.subject || "-"}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-white/80 mb-1" variant="titleMedium">
                  Grade
                </Text>
                <Text className="text-white" variant="titleMedium">
                  {gradeDisplay || "-"}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-white/80 mb-1" variant="titleMedium">
                  Section
                </Text>
                <Text className="text-white" variant="titleMedium">
                  {parsedData.section || " for all section"}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-white/80 mb-1" variant="titleMedium">
                  Max Score
                </Text>
                <Text className="text-white" variant="titleMedium">
                  {String(parsedData.max_score ?? "-")}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-white/80 mb-1" variant="titleMedium">
                  Note
                </Text>
                <Text className="text-white" variant="bodyLarge">
                  {parsedData.note || "-- not available --"}
                </Text>
              </View>
              <View>
                <Text className="text-white/80 mb-1" variant="titleMedium">
                  Created At
                </Text>
                <Text className="text-white" variant="titleMedium">
                  {createdAt}
                </Text>
              </View>
            </View>
          </ScrollView>

          <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 pt-4 pb-6">
            {canModify ? (
              <>
                <Button
                  title="Edit"
                  onPress={handleEdit}
                  disabled={!parsedData || isDeleting}
                  style={{ marginBottom: 10 }}
                />
                <Button
                  title="Delete"
                  onPress={handleDelete}
                  disabled={!parsedData || isDeleting}
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
              <View className="mb-4">
                <Text
                  className="text-center text-gray-500"
                  variant="bodyMedium"
                  style={{
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Created by administrator.
                </Text>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
}
