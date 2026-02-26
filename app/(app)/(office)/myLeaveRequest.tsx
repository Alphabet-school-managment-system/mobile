import FlatList from "@/components/flatList";
import { Text } from "@/components/ui/text";
import { StatusIndicator } from "@/constants/status";
import { LeaveRequest } from "@/models";
import { UserContext } from "@/store/userContext";
import { defaultUtilProps, UtilContext } from "@/store/utilContext";
import dayjs from "dayjs";
import { router } from "expo-router";
import { useContext, useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";

type LeaveRequestItemProps = {
  item: LeaveRequest;
};

function LeaveRequestItem({ item }: LeaveRequestItemProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      className="rounded-lg p-4 mb-3"
      style={{
        backgroundColor: colors.primary,
      }}
      onPress={() => {
        router.push({
          pathname: "/(app)/(office)/leaveRequestDetail",
          params: { leaveRequest: JSON.stringify(item) },
        });
      }}
    >
      <View className="flex flex-row items-center justify-between mb-2">
        <Text className="text-white" variant="titleMedium">
          {`${dayjs(item.start_date).format("MMM D, YYYY")} - ${item.end_date ? dayjs(item.end_date).format("MMM D, YYYY") : "Same Date"}`}
        </Text>

        <StatusIndicator status={item.status} />
      </View>
    </TouchableOpacity>
  );
}

export default function Index() {
  const { userData } = useContext(UserContext);
  const { setUtil } = useContext(UtilContext);

  const apiEndpoint = `leave-request/search/?${[userData?.role]}_id=${userData?.id}`;

  useEffect(() => {
    return () => {
      setUtil({
        ...defaultUtilProps,
      });
    };
  }, []);

  return (
    <FlatList<LeaveRequest>
      apiEndpoint={apiEndpoint}
      renderItem={({ item }: { item: LeaveRequest }) => (
        <LeaveRequestItem item={item} />
      )}
      header={""}
      enableFetch={true}
      emptyDataTitle={"No leave request yet."}
    />
  );
}
