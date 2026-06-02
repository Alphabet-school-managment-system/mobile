import { Index as ConfirmationModal } from "@/components/common/confirmationModal";
import Button, { buttonMode } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useApiMutation } from "@/hooks/useApi";
import { Student } from "@/models";
import {
    ConfirmationModalContext,
    defaultModalProps,
    ModalContext,
    ModalPropsType,
} from "@/store/providers/ModalContext";
import { UserContext } from "@/store/providers/UserContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ReadMore from "@fawazahmed/react-native-read-more";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "react-native-paper";
import { BehaviorReportDetail } from "../types";

const formatDate = (value?: string | Date | null) => {
  if (!value) return "-";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("MMM D, YYYY") : String(value);
};

const formatStudentName = (student?: Student) => {
  if (!student) return "-";

  return [student.first_name, student.middle_name, student.last_name]
    .filter((part) => Boolean(part && String(part).trim()))
    .join(" ")
    .trim();
};

export default function Index() {
  const { colors } = useTheme();
  const { userData } = useContext(UserContext);
  const { setModalProps } = useContext(ModalContext);
  const { setConfirmationModalProps } = useContext(ConfirmationModalContext);
  const { behavior: stringifiedBehavior } = useLocalSearchParams<{
    behavior: string;
  }>();
  const [loading, setLoading] = useState(false);

  const parsedBehavior = useMemo<BehaviorReportDetail | undefined>(() => {
    if (!stringifiedBehavior) return undefined;
    try {
      return JSON.parse(stringifiedBehavior) as BehaviorReportDetail;
    } catch {
      return undefined;
    }
  }, [stringifiedBehavior]);

  const behaviorId = useMemo(() => {
    if (parsedBehavior?.id) return String(parsedBehavior.id);
    return undefined;
  }, [parsedBehavior?.id]);

  const behavior = parsedBehavior;

  const canModify = !!behavior && !!userData?.id;

  const { mutate: deleteBehavior, isPending: isDeleting } = useApiMutation(
    ["behavior"],
    behaviorId ? `behavior/${behaviorId}/delete` : "behavior",
    "DELETE",
  );

  const handleEdit = () => {
    if (!behavior) return;

    router.push({
      pathname: "/(app)/(behavior-report)/new",
      params: { behavior: JSON.stringify(behavior) },
    });
  };

  const handleDelete = () => {
    if (!behavior || !canModify || !behaviorId) return;

    setConfirmationModalProps((prev) => ({
      ...prev,
      show: true,
      title: "Confirmation",
      content: "Are you sure you want to delete this behavior report?",
      okButtonText: "Yes, delete",
      cancelButtonText: "No",
      onOk: () => {
        setLoading(true);
        deleteBehavior(
          { body: {} },
          {
            onSuccess: () => {
              setLoading(false);
              router.replace("/(app)/(behavior-report)");
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
      widthPercent: 80,
    }));
  };

  useEffect(() => {
    setModalProps((prev: ModalPropsType) => ({
      ...prev,
      show: loading || isDeleting,
      content: undefined,
      loadingText: isDeleting
        ? "Deleting ..."
        : loading
          ? "Loading ..."
          : "Loading ...",
    }));
  }, [isDeleting, loading, setModalProps]);

  if (!behavior) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <MaterialCommunityIcons
          name="file-document-outline"
          size={52}
          color="#9CA3AF"
        />
        <Text className="mt-3 text-center text-gray-700" variant="titleMedium">
          Behavior report not found
        </Text>
        <Text className="mt-2 text-center text-gray-500" variant="bodyMedium">
          We could not load the selected behavior report.
        </Text>
      </View>
    );
  }

  const studentName = formatStudentName(behavior.enrollment?.student);
  const reportType = behavior.type ?? "-";
  const reportDate = formatDate(behavior.date);

  const isPositive = behavior.type === "Positive";

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-5 pt-5"
        contentContainerStyle={{ paddingBottom: 190 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="rounded-2xl border p-5"
          style={{
            backgroundColor: isPositive ? "#ECFDF5" : "#FEF2F2",
            borderColor: isPositive ? "#A7F3D0" : "#FECACA",
          }}
        >
          <View className="mb-5 flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text className="text-gray-500" variant="labelLarge">
                Student
              </Text>
              <Text className="mt-1 text-gray-900" variant="titleLarge">
                {studentName}
              </Text>
            </View>

            <View
              className="rounded-full px-3 py-1"
              style={{
                backgroundColor: isPositive ? "#10B981" : colors.error,
              }}
            >
              <Text className="text-white" variant="labelSmall">
                {reportType}
              </Text>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-500" variant="labelLarge">
              Date
            </Text>
            <Text className="mt-1 text-gray-900" variant="titleMedium">
              {reportDate}
            </Text>
          </View>

          <View>
            <Text className="text-gray-500" variant="labelLarge">
              Description
            </Text>
            <View className="mt-2">
              {behavior?.description ? (
                <ReadMore
                  numberOfLines={4}
                  seeMoreText="See more"
                  seeLessText="See less"
                  seeMoreStyle={{ fontWeight: "600" }}
                  seeLessStyle={{ fontWeight: "600" }}
                >
                  {behavior?.description}
                </ReadMore>
              ) : (
                <Text className="text-gray-700" variant="bodyMedium">
                  No description provided.
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-5 pb-6 pt-4">
        <Button
          title="Edit"
          onPress={handleEdit}
          style={{ marginBottom: 12 }}
        />
        <Button
          title="Delete"
          onPress={handleDelete}
          mode={buttonMode.OUTLINE}
          tranparent={true}
          textColor="#DC2626"
          style={{
            marginBottom: 0,
            borderColor: "#FCA5A5",
            borderWidth: 1,
          }}
          contentStyle={{ height: 50 }}
        />
      </View>
    </View>
  );
}
