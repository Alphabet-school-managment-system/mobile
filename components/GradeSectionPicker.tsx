import { Index as Menu, MenuItemtype } from "@/components/menu";
import { Text } from "@/components/ui/text";
import { ErrorMessage } from "@/components/ui/textinput";
import { useApiQuery } from "@/hooks/useApi";
import { getGradeLabel } from "@/hooks/useUtil";
import { selectType } from "@/models";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useMemo } from "react";
import { Path as FormPath, UseFormSetValue } from "react-hook-form";
import { View } from "react-native";

type AssignedGrade = {
  grade: string | number;
  section: string;
};

type GradeSectionFormValues = {
  grade?: string;
  section?: string;
};

type UseGradeSectionOptionsParams<T extends GradeSectionFormValues> = {
  userId?: string;
  academicYearId?: string;
  selectedGrade?: string;
  selectedSection?: string;
  setValue: UseFormSetValue<T>;
};

type GradeSectionPickerProps = {
  selectedGrade?: string;
  selectedGradeDisplay: string;
  selectedSection?: string;
  gradeMenuItems: MenuItemtype[];
  sectionMenuItems: MenuItemtype[];
  gradeErrorMessage?: string;
  sectionErrorMessage?: string;
};

export const useGradeSectionOptions = <T extends GradeSectionFormValues>(
  params: UseGradeSectionOptionsParams<T>,
) => {
  const {
    userId,
    academicYearId,
    selectedGrade,
    selectedSection,
    setValue,
  } = params;

  const { data: assignedGrades = [] } = useApiQuery<AssignedGrade[]>(
    ["my-assigned-grade", userId ?? "", academicYearId ?? ""],
    `teacher/my-assigned-grade/${userId}/${academicYearId}`,
    Boolean(userId && academicYearId),
  );

  const sectionsByGrade = useMemo(() => {
    const grouped = new Map<string, selectType[]>();

    assignedGrades.forEach((item) => {
      const gradeKey = String(item.grade);
      const sectionValue = item.section;

      if (!grouped.has(gradeKey)) {
        grouped.set(gradeKey, []);
      }

      const sections = grouped.get(gradeKey) as selectType[];
      if (!sections.some((section) => section.value === sectionValue)) {
        sections.push({ label: sectionValue, value: sectionValue });
      }
    });

    return grouped;
  }, [assignedGrades]);

  const availableGrades = useMemo<selectType[]>(
    () =>
      Array.from(sectionsByGrade.keys()).map((grade) => {
        const label = getGradeLabel(Number(grade));
        return {
          label: label === "-" ? grade : label,
          value: grade,
        };
      }),
    [sectionsByGrade],
  );

  const availableSections = useMemo<selectType[]>(() => {
    if (!selectedGrade) return [];
    return sectionsByGrade.get(selectedGrade) ?? [];
  }, [sectionsByGrade, selectedGrade]);

  useEffect(() => {
    if (!selectedGrade) {
      if (selectedSection) {
        setValue("section" as FormPath<T>, undefined as any, {
          shouldValidate: true,
        });
      }
      return;
    }

    if (
      selectedSection &&
      !availableSections.some((section) => section.value === selectedSection)
    ) {
      setValue("section" as FormPath<T>, undefined as any, {
        shouldValidate: true,
      });
    }
  }, [availableSections, selectedGrade, selectedSection, setValue]);

  const gradeMenuItems = useMemo<MenuItemtype[]>(() => {
    if (!availableGrades.length) {
      return [
        {
          title: "No assigned grades",
          leadingIcon: "alert-circle-outline",
          onPress: () => {},
        },
      ];
    }

    return availableGrades.map((grade) => ({
      title: grade.label,
      leadingIcon: selectedGrade === grade.value ? "check" : "school-outline",
      onPress: () => {
        setValue("grade" as FormPath<T>, String(grade.value) as any, {
          shouldValidate: true,
        });
      },
    }));
  }, [availableGrades, selectedGrade, setValue]);

  const sectionMenuItems = useMemo<MenuItemtype[]>(() => {
    if (!selectedGrade) {
      return [
        {
          title: "Select grade first",
          leadingIcon: "information-outline",
          onPress: () => {},
        },
      ];
    }

    if (!availableSections.length) {
      return [
        {
          title: "No sections",
          leadingIcon: "alert-circle-outline",
          onPress: () => {},
        },
      ];
    }

    return [
      {
        title: "None",
        leadingIcon: "close-circle-outline",
        onPress: () => {
          setValue("section" as FormPath<T>, undefined as any, {
            shouldValidate: true,
          });
        },
      },
      ...availableSections.map((section) => ({
        title: section.label,
        leadingIcon:
          selectedSection === section.value
            ? "check-circle-outline"
            : "account-group-outline",
        onPress: () => {
          setValue("section" as FormPath<T>, String(section.value) as any, {
            shouldValidate: true,
          });
        },
      })),
    ];
  }, [availableSections, selectedGrade, selectedSection, setValue]);

  const selectedGradeLabel = selectedGrade
    ? getGradeLabel(Number(selectedGrade))
    : "";

  const selectedGradeDisplay = selectedGrade
    ? selectedGradeLabel === "-"
      ? selectedGrade
      : selectedGradeLabel
    : "Select grade";

  return {
    gradeMenuItems,
    sectionMenuItems,
    selectedGradeDisplay,
  };
};

export default function GradeSectionPicker({
  selectedGrade,
  selectedGradeDisplay,
  selectedSection,
  gradeMenuItems,
  sectionMenuItems,
  gradeErrorMessage,
  sectionErrorMessage,
}: GradeSectionPickerProps) {
  return (
    <>
      <View className="mb-3">
        <Text className="text-base text-gray-600 font-semibold">Grade</Text>
        <View className="mt-2.5 flex-row items-center justify-between border border-gray-300 rounded-lg px-3 py-3 bg-gray-50">
          <Text
            className={selectedGrade ? "text-gray-900" : "text-gray-400"}
          >
            {selectedGradeDisplay || "Select grade"}
          </Text>
          <Menu
            items={gradeMenuItems}
            headerTitle="Select Grade"
            icon={
              <MaterialCommunityIcons
                name="chevron-down"
                size={24}
                color="#6B7280"
              />
            }
          />
        </View>
        {gradeErrorMessage ? (
          <View className="mt-3">
            <ErrorMessage message={gradeErrorMessage} show={true} />
          </View>
        ) : null}
      </View>

      <View className="mb-3">
        <Text className="text-base text-gray-600 font-semibold">
          Section (optional)
        </Text>
        <View className="mt-2.5 flex-row items-center justify-between border border-gray-300 rounded-lg px-3 py-3 bg-gray-50">
          <Text
            className={selectedSection ? "text-gray-900" : "text-gray-400"}
          >
            {selectedSection || "Select section"}
          </Text>
          <Menu
            items={sectionMenuItems}
            headerTitle="Select Section"
            icon={
              <MaterialCommunityIcons
                name="chevron-down"
                size={24}
                color="#6B7280"
              />
            }
          />
        </View>
        {sectionErrorMessage ? (
          <View className="mt-3">
            <ErrorMessage message={sectionErrorMessage} show={true} />
          </View>
        ) : null}
      </View>
    </>
  );
}
