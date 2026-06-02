import { Text } from "@/components/ui/text";
import ParentStudentRow, {
  RenderEmptyState,
} from "@/features/parent/components/ParentStudentRow";
import { StudentWithEnrollment } from "@/features/parent/types";
import { useApiQuery } from "@/hooks/useApi";
import { UserContext } from "@/store/providers/UserContext";
import { UtilContext } from "@/store/providers/UtilContext";
import dayjs from "dayjs";
import { useContext, useMemo } from "react";
import { FlatList, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function Index() {
  const { userData } = useContext(UserContext);
  const { Util } = useContext(UtilContext);
  const { colors } = useTheme();

  const apiEndpoint = useMemo(() => {
    if (!userData?.id) return "";
    return `parent-student/search?parent_id=${userData?.id}`;
  }, [userData?.id]);

  const {
    data: parentStudents = [],
    isLoading,
    isFetching,
  } = useApiQuery<StudentWithEnrollment[]>(
    ["parent-student", userData?.id ?? ""],
    apiEndpoint,
    Boolean(apiEndpoint),
  );

  const formattedDate = useMemo(() => {
    const sourceDate = Util.serverDate
      ? dayjs(Util.serverDate, "YYYY-MM-DD")
      : dayjs();
    return sourceDate.isValid()
      ? sourceDate.format("dddd, MMM D, YYYY")
      : dayjs().format("dddd, MMM D, YYYY");
  }, [Util.serverDate]);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-5 py-6 mt-4">
        <View
          className="rounded-lg p-5"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white" disableTranslation variant="bodyMedium">
            Welcome back
          </Text>
          <Text
            className="mt-1 text-white"
            disableTranslation
            variant="headlineMedium"
          >
            {userData?.first_name}
          </Text>
          <Text
            className="mt-2 text-white"
            disableTranslation
            variant="bodyMedium"
          >
            Today is {formattedDate}
          </Text>
        </View>

        <View className="mt-5 flex-row items-center justify-between p-4 bg-white/80">
          <View>
            <Text
              className="text-gray-900"
              disableTranslation
              variant="titleLarge"
            >
              Your Children
            </Text>
            <Text
              className="mt-1 text-gray-500"
              disableTranslation
              variant="bodyMedium"
            >
              Students linked to your parent account.
            </Text>
          </View>

          <View className="rounded-lg px-4 py-3 bg-white">
            <Text
              className="text-gray-900"
              disableTranslation
              variant="titleMedium"
            >
              {parentStudents.length} total
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        className="flex-1 px-5 pt-4"
        data={parentStudents}
        keyExtractor={(item, index) => item.enrollment?.id || `${index}`}
        renderItem={({ item }) => <ParentStudentRow item={item} />}
        ListEmptyComponent={() => (
          <RenderEmptyState loading={isLoading || isFetching} />
        )}
        contentContainerStyle={{
          paddingBottom: 32,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        refreshing={isFetching}
      />
    </View>
  );
}
