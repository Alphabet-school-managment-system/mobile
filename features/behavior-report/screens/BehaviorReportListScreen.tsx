import FlatList from "@/components/common/flatList";
import { Text } from "@/components/ui/text";
import { useApiQuery } from "@/hooks/useApi";
import { UserContext } from "@/store/providers/UserContext";
import { useContext, useMemo, useState } from "react";
import { View } from "react-native";
import { Index as FilterHeader } from "../components/BehaviorReportFilterHeader";
import { Index as BehaviorReportRow } from "../components/BehaviorReportRow";
import { BehaviorFilter, BehaviorWithEnrollment } from "../types";

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
    <View className="flex-1">
      <View className="flex-1">
        <FlatList<BehaviorWithEnrollment>
          apiEndpoint={apiEndpoint}
          keyExtractor={(item, index) => item.id || `${index}`}
          header={
            <FilterHeader
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          }
          renderItem={({ item }) => <BehaviorReportRow item={item} />}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 140,
          }}
          emptyDataTitle={
            <View className="flex-1 items-center justify-center px-6">
              <Text className="text-center text-gray-500" variant="bodyLarge">
                {activeFilter === "all"
                  ? "No behavior reports found."
                  : `No ${activeFilter.toLowerCase()} behavior reports found.`}
              </Text>
            </View>
          }
          enableFetch={false}
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
