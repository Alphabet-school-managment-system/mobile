import GradeSectionPicker, {
  CustomDropDown,
} from "@/components/GradeSectionPicker";
import { MenuItemtype } from "@/components/menu";
import Button from "@/components/ui/button";
import { View } from "react-native";

type GradeSectionSelection = {
  grade?: string;
  section?: string;
};

type RenderFiltersContentProps = {
  selectedGradeSec?: GradeSectionSelection;
  selectedGradeDisplay?: string;
  gradeMenuItems: MenuItemtype[];
  sectionMenuItems: MenuItemtype[];
  assessmentMenuItems: MenuItemtype[];
  selectedAssessmentTitle?: string;
  onApply: () => void;
  disableApply: boolean;
  loadingAssessment?: boolean;
  loadingGrade?: boolean;
  loadingSection?: boolean;
};

export default function RenderFiltersContent({
  selectedGradeSec,
  selectedGradeDisplay,
  gradeMenuItems,
  sectionMenuItems,
  assessmentMenuItems,
  selectedAssessmentTitle,
  onApply,
  disableApply,
  loadingAssessment = false,
  loadingGrade = false,
  loadingSection = false,
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
        MenuItems={{ grade: gradeMenuItems, section: sectionMenuItems }}
        ErrorMessage={{ grade: "", section: "" }}
        label={{
          grade: { value: "Grade", show: true },
          section: { value: "Section", show: true },
        }}
        loading={{ grade: loadingGrade, section: loadingSection }}
      />

      <CustomDropDown
        label="Assessment"
        value={selectedAssessmentTitle}
        placeholder="Select assessment"
        menuItems={assessmentMenuItems}
        headerTitle="Select Assessment"
        showLabel={true}
        loading={{
          value: loadingAssessment,
          placeholder: "Loading assessments...",
        }}
      />

      <Button
        title="Apply Filters"
        onPress={onApply}
        disabled={disableApply}
        style={{ marginBottom: 0 }}
      />
    </View>
  );
}
