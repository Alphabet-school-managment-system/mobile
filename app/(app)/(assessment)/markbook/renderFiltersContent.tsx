import GradeSectionPicker from "@/components/GradeSectionPicker";
import { MenuItemtype } from "@/components/menu";
import Button from "@/components/ui/button";
import { ReactElement, cloneElement } from "react";
import { View } from "react-native";

type GradeSectionSelection = {
  grade?: string;
  section?: string;
};

type RenderFiltersContentProps = {
  selectedGradeSec?: GradeSectionSelection;
  selectedGradeDisplay?: string;
  gradeMenuItems: MenuItemtype[];
  sectionMenuItems?: MenuItemtype[];
  extraFilterOption: ReactElement[];
  onApply: () => void;
  disableApply: boolean;
  loadingGrade?: boolean;
  loadingSection?: boolean;
  hideSection?: boolean;
};

export default function RenderFiltersContent({
  selectedGradeSec,
  selectedGradeDisplay,
  gradeMenuItems,
  sectionMenuItems,
  onApply,
  disableApply,
  loadingGrade = false,
  loadingSection = false,
  extraFilterOption = [],
  hideSection,
}: RenderFiltersContentProps) {
  return (
    <View className="px-3 pb-2">
      <GradeSectionPicker
        selected={{
          grade: {
            value: selectedGradeSec?.grade ?? "",
            label: selectedGradeDisplay ?? "",
          },
          section: selectedGradeSec?.section ?? "",
        }}
        MenuItems={{ grade: gradeMenuItems, section: sectionMenuItems ?? [] }}
        ErrorMessage={{ grade: "", section: "" }}
        label={{
          grade: { value: "Grade", show: true },
          section: { value: "Section", show: true },
        }}
        loading={{ grade: loadingGrade, section: loadingSection }}
        hideSection={hideSection}
      />

      {extraFilterOption.map((item: ReactElement, index: number) => {
        return cloneElement(item, {
          key: item.key ?? `extra-filter-${index}`,
        });
      })}

      <Button
        title="Apply Filters"
        onPress={onApply}
        disabled={disableApply}
        style={{ marginBottom: 0 }}
      />
    </View>
  );
}
