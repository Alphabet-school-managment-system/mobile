import { CustomDropDown } from "@/components/GradeSectionPicker";
import { Text } from "@/components/ui/text";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { useApiQuery } from "@/hooks/useApi";
import { Behavior, Student } from "@/models";
import { UserContext } from "@/store/userContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs";
import { router } from "expo-router";
import { useContext, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { useTheme } from "react-native-paper";

type BehaviorFilter = "all" | "Positive" | "Negative";

type BehaviorWithEnrollment = Behavior & {
  enrollment: {
    id: string;
    grade: string;
    section: string;
    student: Student;
  };
};

type BehaviorReportItemProps = {
  item: BehaviorWithEnrollment;
};

function BehaviorReportItem({ item }: BehaviorReportItemProps) {
  const { colors } = useTheme();
  const isPositive = item.type === "Positive";
  const reportDate = dayjs(item.date).format("MMM D, YYYY");

  return (
    <TouchableOpacity
      className="mb-3 rounded-lg px-4 py-4"
      style={{
        backgroundColor: isPositive ? "#ECFDF5" : "#FEF2F2",
        borderColor: isPositive ? "#A7F3D0" : "#FECACA",
        borderWidth: 1,
      }}
      onPress={() => {
        router.push({
          pathname: "/(app)/(behavior-report)/detail",
          params: { behavior: JSON.stringify(item) },
        });
      }}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <View className="mb-2 flex-row items-center gap-2">
            <View
              className="rounded-full px-3 py-1"
              style={{
                backgroundColor: isPositive ? "#10B981" : colors.error,
              }}
            >
              <Text className="text-white" variant="labelSmall">
                {item.type}
              </Text>
            </View>
            <Text className="text-gray-500" variant="bodySmall">
              {reportDate}
            </Text>
          </View>

          <Text className="text-gray-900" variant="titleMedium">
            {item.enrollment?.student
              ? `${item.enrollment.student.first_name} ${item.enrollment.student.middle_name} ${item.enrollment.student.last_name}`
              : ""}
          </Text>

          <Text className="mt-1 text-gray-700" variant="bodyMedium">
            {item.description?.trim() || "No description provided."}
          </Text>
        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={isPositive ? "#059669" : "#DC2626"}
        />
      </View>
    </TouchableOpacity>
  );
}

function FilterHeader({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: BehaviorFilter;
  onFilterChange: (value: BehaviorFilter) => void;
}) {
  const filterValue =
    activeFilter === "all" ? "All reports" : `${activeFilter} reports`;

  const menuItems = useMemo(
    () => [
      {
        title: "All reports",
        leadingIcon:
          activeFilter === "all" ? "check-circle-outline" : "view-list-outline",
        onPress: () => onFilterChange("all"),
      },
      {
        title: "Positive",
        leadingIcon:
          activeFilter === "Positive"
            ? "check-circle-outline"
            : "thumb-up-outline",
        onPress: () => onFilterChange("Positive"),
      },
      {
        title: "Negative",
        leadingIcon:
          activeFilter === "Negative"
            ? "check-circle-outline"
            : "thumb-down-outline",
        onPress: () => onFilterChange("Negative"),
      },
    ],
    [activeFilter, onFilterChange],
  );

  return (
    <View className="mb-4 p-0">
      <CustomDropDown
        label="Report type"
        value={filterValue}
        placeholder="Choose report type"
        headerTitle="Select Report Type"
        menuItems={menuItems}
        showLabel={false}
        menuShowCloseIcon={false}
      />
    </View>
  );
}

export default function Index() {
  const { userData } = useContext(UserContext);
  const [activeFilter, setActiveFilter] = useState<BehaviorFilter>("all");

  const apiEndpoint = useMemo(() => {
    if (!userData?.id) return "";

    const params = new URLSearchParams();
    params.set("teacher_id", userData.id);

    if (activeFilter !== "all") {
      params.set("type", activeFilter);
      params.set("__and", "type");
    }

    return `behavior/search/?${params.toString()}`;
  }, [activeFilter, userData?.id]);

  const { data: behaviors = [], isLoading } = useApiQuery<
    BehaviorWithEnrollment[]
  >(
    ["behavior-report", userData?.id ?? "", activeFilter],
    apiEndpoint,
    Boolean(apiEndpoint),
  );

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-5">
        <FlatList
          data={behaviors}
          keyExtractor={(item, index) => item.id || `${index}`}
          ListHeaderComponent={
            <FilterHeader
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          }
          renderItem={({ item }) => <BehaviorReportItem item={item} />}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 140,
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center px-6">
              <Text className="text-center text-gray-500" variant="bodyLarge">
                {isLoading
                  ? "Loading behavior reports..."
                  : activeFilter === "all"
                    ? "No behavior reports found."
                    : `No ${activeFilter.toLowerCase()} behavior reports found.`}
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-5 pb-6 pt-4">
        <Text className="mb-3 text-center text-gray-500" variant="bodyMedium">
          Manage behavior reports and incidents in your school with ease. Tap
          the plus (+) button above to add a new behavior report.
        </Text>
      </View>
    </View>
  );
}
