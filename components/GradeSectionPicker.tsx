import {
  Index as Menu,
  MenuItemtype,
  type MenuSearchConfig,
} from "@/components/menu";
import { Text } from "@/components/ui/text";
import { ErrorMessage } from "@/components/ui/textinput";
import { useApiQuery } from "@/hooks/useApi";
import { getGradeLabel } from "@/hooks/useUtil";
import { selectType } from "@/models";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Path as FormPath, UseFormSetValue } from "react-hook-form";
import { View } from "react-native";
import Toast from "react-native-toast-message";

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
  setValue?: UseFormSetValue<T>;
  onGradeChange?: (value?: string) => void;
  onSectionChange?: (value?: string) => void;
};

type GradeSectionSelection = {
  grade?: string;
  section?: string;
};

type UseGradeSectionPickerParams = {
  userId?: string;
  academicYearId?: string;
  onGradeChange?: (value?: string) => void;
  onSectionChange?: (value?: string) => void;
};

type GradeSectionPickerProps = {
  selected: {
    grade: {
      value: string;
      label: string;
    };
    section: string;
  };
  MenuItems: {
    grade: MenuItemtype[];
    section: MenuItemtype[];
  };
  ErrorMessage: {
    grade: string;
    section: string;
  };
  label: {
    grade?: {
      value: string;
      show: boolean;
    };
    section?: {
      value: string;
      show: boolean;
    };
  };
  headerTitle?: {
    grade?: string;
    section?: string;
  };
  placeholder?: {
    grade?: string;
    section?: string;
  };
  loading?: {
    grade?: boolean;
    section?: boolean;
  };
  hideSection?: boolean;
  menuSearch?: {
    grade?: MenuSearchConfig;
    section?: MenuSearchConfig;
  };
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
    onGradeChange,
    onSectionChange,
  } = params;

  const {
    data: assignedGrades = [],
    isFetching: assignedGradesLoading,
    isError: assignedGradesError,
    isSuccess: assignedGradesLoaded,
  } = useApiQuery<AssignedGrade[]>(
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

  const updateGrade = useCallback(
    (value?: string) => {
      onGradeChange?.(value);
      if (setValue) {
        setValue("grade" as FormPath<T>, value as any, {
          shouldValidate: true,
        });
      }
    },
    [onGradeChange, setValue],
  );

  const updateSection = useCallback(
    (value?: string) => {
      onSectionChange?.(value);
      if (setValue) {
        setValue("section" as FormPath<T>, value as any, {
          shouldValidate: true,
        });
      }
    },
    [onSectionChange, setValue],
  );

  useEffect(() => {
    if (!selectedGrade) {
      if (selectedSection) {
        updateSection(undefined);
      }
      return;
    }

    if (
      selectedSection &&
      !availableSections.some((section) => section.value === selectedSection)
    ) {
      updateSection(undefined);
    }
  }, [availableSections, selectedGrade, selectedSection, updateSection]);

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
        updateGrade(String(grade.value));
      },
    }));
  }, [availableGrades, selectedGrade, updateGrade]);

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
          updateSection(undefined);
        },
      },
      ...availableSections.map((section) => ({
        title: section.label,
        leadingIcon:
          selectedSection === section.value
            ? "check-circle-outline"
            : "account-group-outline",
        onPress: () => {
          updateSection(String(section.value));
        },
      })),
    ];
  }, [availableSections, selectedGrade, selectedSection, updateSection]);

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
    assignedGrades,
    assignedGradesLoading,
    assignedGradesError,
    assignedGradesLoaded,
    availableGradesCount: availableGrades.length,
  };
};

export const useGradeSectionPicker = ({
  userId,
  academicYearId,
  onGradeChange,
  onSectionChange,
}: UseGradeSectionPickerParams) => {
  const [selectedGradeSec, setSelectedGradeSec] =
    useState<GradeSectionSelection>();

  const {
    gradeMenuItems,
    sectionMenuItems,
    selectedGradeDisplay,
    assignedGradesLoading,
    assignedGradesError,
    assignedGradesLoaded,
    availableGradesCount,
  } = useGradeSectionOptions({
    userId,
    academicYearId,
    selectedGrade: selectedGradeSec?.grade,
    selectedSection: selectedGradeSec?.section,
    onGradeChange: (value?: string) => {
      setSelectedGradeSec({ grade: value, section: undefined });
      onGradeChange?.(value);
    },
    onSectionChange: (value?: string) => {
      setSelectedGradeSec((prev) => ({ ...prev, section: value }));
      onSectionChange?.(value);
    },
  });

  const showGradeSectionLoading =
    Boolean(userId && academicYearId) &&
    assignedGradesLoading &&
    !assignedGradesError &&
    availableGradesCount > 0;

  const lastGradeToastRef = useRef<string>("");

  useEffect(() => {
    if (!userId || !academicYearId) return;
    const toastKey = assignedGradesError
      ? "grade|error"
      : assignedGradesLoaded && availableGradesCount === 0
        ? "grade|empty"
        : "";

    if (!toastKey || lastGradeToastRef.current === toastKey) return;
    lastGradeToastRef.current = toastKey;

    if (assignedGradesError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load grades/sections.",
      });
      return;
    }

    Toast.show({
      type: "info",
      text1: "No grades",
      text2: "No grades/sections assigned.",
    });
  }, [
    userId,
    academicYearId,
    assignedGradesError,
    assignedGradesLoaded,
    availableGradesCount,
  ]);

  return {
    selectedGradeSec,
    setSelectedGradeSec,
    gradeMenuItems,
    sectionMenuItems,
    selectedGradeDisplay,
    showGradeSectionLoading,
  };
};

type CustomDropDownProps = {
  label: string;
  value?: string;
  placeholder: string;
  menuItems: MenuItemtype[];
  headerTitle: string;
  errorMessage?: string;
  disabled?: boolean;
  showLabel?: boolean;
  menuSearch?: MenuSearchConfig;
  menuShowCloseIcon?: boolean;
  loading?: {
    value?: boolean;
    placeholder?: string;
  };
};

export const CustomDropDown = ({
  label,
  value,
  placeholder,
  menuItems,
  headerTitle,
  errorMessage,
  disabled,
  showLabel = true,
  menuSearch,
  menuShowCloseIcon = true,
  loading = {
    value: false,
    placeholder: undefined,
  },
}: CustomDropDownProps) => {
  return (
    <View className="mb-3">
      {showLabel && (
        <Text className="text-base text-gray-600 font-semibold">{label}</Text>
      )}
      <View className="mt-2.5 flex-row items-center justify-between border border-gray-300 rounded-lg px-3 py-3 bg-gray-50">
        <Text className={value ? "text-gray-900" : "text-gray-400"}>
          {loading?.value ? loading?.placeholder : value || placeholder}
        </Text>
        <Menu
          items={menuItems}
          headerTitle={headerTitle}
          icon={
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color="#6B7280"
            />
          }
          disabled={disabled}
          search={menuSearch}
          showCloseIcon={menuShowCloseIcon}
        />
      </View>
      {errorMessage ? (
        <View className="mt-3">
          <ErrorMessage message={errorMessage} show={true} />
        </View>
      ) : null}
    </View>
  );
};

export default function GradeSectionPicker({
  selected,
  MenuItems,
  ErrorMessage,
  label,
  headerTitle,
  placeholder,
  loading,
  hideSection = false,
  menuSearch,
}: GradeSectionPickerProps) {
  const showGradeLoading = Boolean(loading?.grade);
  const showSectionLoading = Boolean(loading?.section);

  return (
    <>
      <CustomDropDown
        label={label.grade?.value ?? "Grade"}
        value={selected.grade.value ? selected.grade.label : undefined}
        placeholder={placeholder?.grade ?? "Select grade"}
        headerTitle={headerTitle?.grade ?? "Select Grade"}
        menuItems={MenuItems.grade}
        errorMessage={ErrorMessage.grade}
        showLabel={label.grade?.show}
        menuSearch={menuSearch?.grade}
        loading={{
          value: showGradeLoading,
          placeholder: "Loading grades...",
        }}
      />
      {!hideSection && (
        <CustomDropDown
          label={label.section?.value ?? "Section (optional)"}
          value={selected.section || undefined}
          placeholder={placeholder?.section ?? "Select section"}
          headerTitle={headerTitle?.section ?? "Select Section"}
          menuItems={MenuItems.section}
          errorMessage={ErrorMessage.section}
          showLabel={label.section?.show}
          menuSearch={menuSearch?.section}
          loading={{
            value: showSectionLoading,
            placeholder: "Loading sections...",
          }}
        />
      )}
    </>
  );
}
