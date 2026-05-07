import { MenuItemtype } from "@/components/common/menu";
import { useApiQuery } from "@/hooks/useApi";
import { Assessment } from "@/models";
import { useEffect, useMemo, useRef, useState } from "react";
import Toast from "react-native-toast-message";
import { SelectedAssessment, UseAssessmentParams } from "../types";

export const useAssessment = ({
  selectedGradeSec,
  onAssessmentChange,
}: UseAssessmentParams) => {
  const [selectedAssessment, setSelectedAssessment] =
    useState<SelectedAssessment>();

  const assessmentsEndpoint = useMemo(() => {
    const params = new URLSearchParams();

    if (selectedGradeSec?.grade) params.set("grade", selectedGradeSec.grade);
    if (selectedGradeSec?.section)
      params.set("section", selectedGradeSec.section);

    const qs = params.toString();
    if (!selectedGradeSec?.section) return "";
    return `assessment/search/?${qs}`;
  }, [selectedGradeSec]);

  const {
    data: assessments = [],
    isFetching: loadingAssessment,
    isError: assessmentsError,
    isSuccess: assessmentsLoaded,
  } = useApiQuery<Assessment[]>(
    [assessmentsEndpoint],
    assessmentsEndpoint,
    Boolean(assessmentsEndpoint),
  );

  const showAssessmentLoading =
    Boolean(assessmentsEndpoint) &&
    loadingAssessment &&
    !assessmentsError &&
    assessments.length > 0;

  const lastAssessmentToastRef = useRef<string>("");

  useEffect(() => {
    if (!assessmentsEndpoint) return;
    const toastKey = assessmentsError
      ? `${assessmentsEndpoint}|error`
      : assessmentsLoaded && assessments.length === 0
        ? `${assessmentsEndpoint}|empty`
        : "";

    if (!toastKey || lastAssessmentToastRef.current === toastKey) return;
    lastAssessmentToastRef.current = toastKey;

    if (assessmentsError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load assessments.",
      });
      return;
    }

    Toast.show({
      type: "info",
      text1: "No assessments",
      text2: "No assessments found for this section.",
    });
  }, [
    assessmentsEndpoint,
    assessmentsError,
    assessmentsLoaded,
    assessments.length,
  ]);

  useEffect(() => {
    if (selectedAssessment?.id) return;
    onAssessmentChange?.(undefined);
  }, [selectedAssessment?.id, onAssessmentChange]);

  useEffect(() => {
    if (!selectedGradeSec?.section) {
      setSelectedAssessment(undefined);
      onAssessmentChange?.(undefined);
    }
  }, [selectedGradeSec?.grade, selectedGradeSec?.section, onAssessmentChange]);

  const assessmentMenuItems = useMemo<MenuItemtype[]>(() => {
    if (!assessments.length) {
      return [
        {
          title: "No assessments",
          leadingIcon: "alert-circle-outline",
          onPress: () => {},
        },
      ];
    }

    return assessments.map((assessment) => ({
      title: assessment.title,
      leadingIcon:
        selectedAssessment?.id === assessment.id
          ? "check-circle-outline"
          : "book-outline",
      onPress: () => {
        const next = {
          id: assessment.id,
          title: assessment.title,
          max_score: assessment.max_score,
        };
        setSelectedAssessment(next);
        onAssessmentChange?.(next);
      },
    }));
  }, [assessments, selectedAssessment?.id, onAssessmentChange]);

  return {
    assessments,
    assessmentsEndpoint,
    selectedAssessment,
    setSelectedAssessment,
    assessmentMenuItems,
    loadingAssessment,
    showAssessmentLoading,
  };
};
