import { CustomDropDown } from "@/components/common/GradeSectionPicker";
import { useMemo } from "react";
import { View } from "react-native";
import { BehaviorFilter } from "../types";

function Index({
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

export { Index };
