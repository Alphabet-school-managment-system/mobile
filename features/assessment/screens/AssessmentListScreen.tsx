import FlatList from "@/components/common/flatList";
import { Index as Menu, MenuItemtype } from "@/components/common/menu";
import { Text } from "@/components/ui/text";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { Assessment } from "@/models";
import { UserContext } from "@/store/providers/UserContext";
import { defaultUtilProps, UtilContext } from "@/store/providers/UtilContext";
import Entypo from "@expo/vector-icons/Entypo";
import dayjs from "dayjs";
import { router } from "expo-router";
import { useContext, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

type AssessmentFilter = "mine" | "general";

type AssessmentItemProps = {
  item: Assessment;
};

function AssessmentItem({ item }: AssessmentItemProps) {
  const { colors } = useTheme();
  const createdAt = item.created_at
    ? dayjs(item.created_at).format("MMM D, YYYY")
    : "-";

  return (
    <TouchableOpacity
      className="rounded-lg p-4 mb-3"
      style={{ backgroundColor: colors.primary }}
      onPress={() => {
        router.push({
          pathname: "/(app)/(assessment)/[id]",
          params: { assessment: JSON.stringify(item) },
        });
      }}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-white mb-1" variant="titleMedium">
            {item.title}
          </Text>
          <Text className="text-white/90 uppercase" variant="bodyMedium">
            {item.subject}
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-white font-bold" variant="titleSmall">
            {item.max_score}
          </Text>
          <Text className="text-white/90" variant="bodySmall">
            Max Score
          </Text>
        </View>
      </View>

      <View className="mt-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          {/* <MaterialCommunityIcons
            name="calendar-range"
            size={16}
            color="white"
          /> */}
          <Text className="text-white" variant="bodySmall">
            {createdAt}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FilterHeader({
  activeFilter,
  filterMenuItems,
}: {
  activeFilter: AssessmentFilter | undefined;
  filterMenuItems: MenuItemtype[];
}) {
  return (
    <View className="mb-4 flex-row items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
      <View>
        <Text variant="titleMedium">
          {activeFilter
            ? activeFilter === "mine"
              ? "My Assessments"
              : "General Assessments"
            : "Select a filter"}
        </Text>
      </View>

      <View className="rounded-full px-1 py-1">
        <Menu
          items={filterMenuItems}
          headerTitle="Assessment Filter"
          icon={<Entypo name="select-arrows" size={24} color="gray" />}
        />
      </View>
    </View>
  );
}

export default function Index() {
  const { userData } = useContext(UserContext);
  const { setUtil } = useContext(UtilContext);
  const [activeFilter, setActiveFilter] = useState<
    AssessmentFilter | undefined
  >("general");

  useEffect(() => {
    return () => {
      setUtil({
        ...defaultUtilProps,
      });
    };
  }, [setUtil]);

  const filterMenuItems = useMemo<MenuItemtype[]>(
    () => [
      {
        title: "Mine",
        leadingIcon:
          activeFilter === "mine" ? "check-circle-outline" : "account-outline",
        onPress: () => {
          setActiveFilter("mine");
        },
      },
      {
        title: "General",
        leadingIcon:
          activeFilter === "general"
            ? "check-circle-outline"
            : "view-list-outline",
        onPress: () => {
          setActiveFilter("general");
        },
      },
    ],
    [activeFilter],
  );

  const apiEndpoint =
    activeFilter === "mine"
      ? `assessment/search/?teacher_id=${userData?.id}`
      : `assessment/search/?subject=${userData?.subject_specialization}`;
  return (
    <FlatList<Assessment>
      apiEndpoint={apiEndpoint}
      renderItem={({ item }: { item: Assessment }) => (
        <AssessmentItem item={item} />
      )}
      header={
        <FilterHeader
          activeFilter={activeFilter}
          filterMenuItems={filterMenuItems}
        />
      }
      enableFetch={false}
      emptyDataTitle={
        activeFilter === "mine"
          ? "No assessments created by you yet."
          : "No assessments available yet."
      }
    />
  );
}
