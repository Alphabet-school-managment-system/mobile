import Button, { buttonMode } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { statusStyles } from "@/constants/status";
import { useApiMutation } from "@/hooks/useApi";
import { LeaveRequest } from "@/models";
import { ModalContext, ModalPropsType } from "@/store/modalContext";
import { UtilContext } from "@/store/utilContext";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useMemo } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function Index() {
  const apiRoute = "leave-request";
  const { leaveRequest: stringfiedData } = useLocalSearchParams<{
    leaveRequest?: string;
  }>();
  const { colors } = useTheme();
  const { Util, setUtil } = useContext(UtilContext);
  const { setModalProps } = useContext(ModalContext);

  const parsedData = useMemo<LeaveRequest | undefined>(
    () =>
      stringfiedData ? (JSON.parse(stringfiedData) as LeaveRequest) : undefined,
    [stringfiedData],
  );

  const isLoading = typeof stringfiedData === "undefined";

  const { mutate: cancelRequest, isPending: isCanceling } = useApiMutation(
    [apiRoute],
    `${apiRoute}/${parsedData?.id}`,
    "DELETE",
  );

  const leaveRequest = useMemo<LeaveRequest | undefined>(
    () => parsedData as LeaveRequest | undefined,
    [stringfiedData],
  );

  const statusKey = (leaveRequest?.status || "Pending").toLowerCase();
  const statusStyle = statusStyles[statusKey] || statusStyles.pending;
  const canModify = statusKey === "pending";

  const handleEdit = () => {
    if (!canModify) return;
    setUtil({
      ...Util,
      routeTitle: "Update Leave Request",
    });
    router.push({
      pathname: "/(app)/(office)/leaveRequestForm",
      params: { leaveRequest: stringfiedData },
    });
  };

  const handleCancel = () => {
    if (!canModify) return;
    Alert.alert(
      "Cancel leave request",
      "Are you sure you want to cancel this leave request?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            cancelRequest(
              { body: {} },
              {
                onSuccess: () => {
                  router.replace("/(app)/(office)/myLeaveRequest");
                },
              },
            );
          },
        },
      ],
    );
  };

  useEffect(() => {
    setModalProps((prev: ModalPropsType) => ({
      ...prev,
      show: isCanceling,
      loadingText: "Canceling ...",
    }));
  }, [isCanceling]);

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 p-5"
        contentContainerStyle={{ paddingBottom: 180 }}
      >
        {isLoading ? (
          <Text className="text-center mt-10 text-gray-600" variant="bodyLarge">
            Loading leave request details...
          </Text>
        ) : (
          <View
            className="rounded-xl p-5"
            style={{ backgroundColor: colors.primary }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white font-bold" variant="titleLarge">
                Status
              </Text>
              <View className={`px-2 py-1 rounded-full ${statusStyle.bg}`}>
                <Text
                  className={`text-xs font-semibold uppercase ${statusStyle.text}`}
                >
                  {leaveRequest?.status || "Pending"}
                </Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-white/80 mb-1" variant="titleMedium">
                Start Date
              </Text>
              <Text className="text-white" variant="titleMedium">
                {leaveRequest?.start_date
                  ? dayjs(leaveRequest?.start_date).format("MMM D, YYYY")
                  : "-"}
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-white/80 mb-1" variant="titleMedium">
                End Date
              </Text>
              <Text className="text-white" variant="titleMedium">
                {leaveRequest?.end_date
                  ? dayjs(leaveRequest?.end_date).format("MMM D, YYYY")
                  : "Same Date"}
              </Text>
            </View>

            <View>
              <Text className="text-white/80 mb-1" variant="titleMedium">
                Note
              </Text>
              <Text className="text-white" variant="bodyLarge">
                {leaveRequest?.note || "-- not available --"}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 pt-4 pb-6">
        {!canModify && !!leaveRequest ? (
          <Text className="text-center text-sm text-gray-500 mb-2">
            Only pending requests can be edited or canceled.
          </Text>
        ) : null}
        <Button
          title="Edit"
          onPress={handleEdit}
          disabled={!leaveRequest || !canModify || isCanceling}
          style={{ marginBottom: 10 }}
        />
        <Button
          title="Cancel Request"
          onPress={handleCancel}
          disabled={!leaveRequest || !canModify || isCanceling}
          mode={buttonMode.OUTLINE}
          tranparent={true}
          textColor="#dc2626"
          style={{ marginBottom: 0, borderColor: "#dc2626", borderWidth: 1 }}
        />
      </View>
    </View>
  );
}
