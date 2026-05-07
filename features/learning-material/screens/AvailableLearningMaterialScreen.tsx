import { CustomDropDown } from "@/components/common/GradeSectionPicker";
import { Index as Loading } from "@/components/common/loading";
import Button from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { TextInput } from "@/components/ui/textinput";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { useApiQuery } from "@/hooks/useApi";
import { useUtil } from "@/hooks/useUtil";
import { LearningMaterial, selectType } from "@/models";
import { BottomSheetContext } from "@/store/providers/BottomSheetContext";
import { IdsContext } from "@/store/providers/IdContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useContext, useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { useTheme } from "react-native-paper";
import { Index as LearningMaterialRow } from "../components/LearningMaterialRow";
import { QueryMode } from "../types";

export default function Index() {
  const { Ids } = useContext(IdsContext);
  const { colors } = useTheme();
  const { subjects, getGradeLabel, GRADE_VALUES } = useUtil();
  const {
    openBottomSheet,
    closeBottomSheet,
    bottomSheetProps,
    setBottomSheetProps,
  } = useContext(BottomSheetContext);

  const [searchText, setSearchText] = useState("");
  const [appliedSearchText, setAppliedSearchText] = useState("");
  const [fetchSearch, setFetchSearch] = useState(false);
  const [draftGrade, setDraftGrade] = useState<string | undefined>();
  const [draftSubject, setDraftSubject] = useState<selectType | undefined>();
  const [appliedGrade, setAppliedGrade] = useState<string | undefined>();
  const [appliedSubject, setAppliedSubject] = useState<
    selectType | undefined
  >();
  const [fetchFilters, setFetchFilters] = useState(false);
  const [activeQueryMode, setActiveQueryMode] = useState<QueryMode>("base");

  const baseEndpoint = useMemo(() => {
    if (!Ids?.branchId) return "";
    const params = new URLSearchParams();
    params.set("branch_id", Ids.branchId);
    return `learning-material/search?${params.toString()}`;
  }, [Ids?.branchId]);

  const searchEndpoint = useMemo(() => {
    if (!Ids?.branchId || !appliedSearchText.trim()) return "";

    const params = new URLSearchParams();
    params.set("branch_id", Ids.branchId);
    params.set("title", appliedSearchText.trim());
    params.set("__and", "branch_id,title");

    return `learning-material/search?${params.toString()}`;
  }, [Ids?.branchId, appliedSearchText]);

  const filterEndpoint = useMemo(() => {
    if (!Ids?.branchId || !appliedGrade || !appliedSubject?.value) return "";

    const params = new URLSearchParams();
    params.set("branch_id", Ids.branchId);
    params.set("grade", appliedGrade);
    params.set("subject", String(appliedSubject.value));
    params.set("__and", "branch_id,grade,subject");

    return `learning-material/search?${params.toString()}`;
  }, [Ids?.branchId, appliedGrade, appliedSubject?.value]);

  const {
    data: baseMaterials = [],
    isLoading: baseLoading,
    isError: baseError,
  } = useApiQuery<LearningMaterial[]>(
    ["available-learning-materials", Ids?.branchId ?? ""],
    baseEndpoint,
    Boolean(baseEndpoint),
  );

  const {
    data: searchMaterials = [],
    isLoading: searchLoading,
    isSuccess: searchLoaded,
    isError: searchError,
  } = useApiQuery<LearningMaterial[]>(
    [
      "available-learning-materials-search",
      Ids?.branchId ?? "",
      appliedSearchText,
    ],
    searchEndpoint,
    Boolean(fetchSearch && searchEndpoint),
  );

  const {
    data: filterMaterials = [],
    isLoading: filterLoading,
    isSuccess: filterLoaded,
    isError: filterError,
  } = useApiQuery<LearningMaterial[]>(
    [
      "available-learning-materials-filter",
      Ids?.branchId ?? "",
      appliedGrade ?? "all",
      appliedSubject?.value ?? "all",
    ],
    filterEndpoint,
    Boolean(fetchFilters && filterEndpoint),
  );

  useEffect(() => {
    if (!fetchSearch) return;
    if (searchLoaded || searchError) {
      setFetchSearch(false);
    }
  }, [fetchSearch, searchLoaded, searchError]);

  useEffect(() => {
    if (!fetchFilters) return;
    if (filterLoaded || filterError) {
      setFetchFilters(false);
    }
  }, [fetchFilters, filterLoaded, filterError]);

  const gradeMenuItems = useMemo(
    () => [
      {
        title: "All grades",
        leadingIcon: draftGrade ? "format-list-bulleted" : "check",
        onPress: () => setDraftGrade(undefined),
      },
      ...GRADE_VALUES.map((grade) => ({
        title: getGradeLabel(grade),
        leadingIcon: draftGrade === String(grade) ? "check" : "school-outline",
        onPress: () => setDraftGrade(String(grade)),
      })),
    ],
    [getGradeLabel, draftGrade],
  );

  const subjectMenuItems = useMemo(
    () => [
      {
        title: "All subjects",
        leadingIcon: draftSubject ? "format-list-bulleted" : "check",
        onPress: () => setDraftSubject(undefined),
      },
      ...subjects.map((item: selectType) => ({
        title: item.label,
        leadingIcon:
          draftSubject?.value === item.value ? "check" : "book-outline",
        onPress: () => setDraftSubject(item),
      })),
    ],
    [draftSubject, subjects],
  );

  const buildFiltersNode = (grade?: string, subject?: selectType) => (
    <View className="px-3 pb-2">
      <CustomDropDown
        label="Grade"
        value={
          grade
            ? (() => {
                const label = getGradeLabel(Number(grade));
                return label === "-" ? grade : label;
              })()
            : undefined
        }
        placeholder="All grades"
        menuItems={gradeMenuItems}
        headerTitle="Select grade"
        showLabel={true}
        menuShowCloseIcon={true}
      />

      <CustomDropDown
        label="Subject"
        value={subject?.label}
        placeholder="All subjects"
        menuItems={subjectMenuItems}
        headerTitle="Select subject"
        showLabel={true}
        menuSearch={{ placeholder: "Search subject" }}
        menuShowCloseIcon={true}
      />

      <Button
        title="Apply Filters"
        onPress={() => {
          setAppliedGrade(grade);
          setAppliedSubject(subject);
          setActiveQueryMode("filter");
          setFetchFilters(true);
          closeBottomSheet();
        }}
        disabled={!grade || !subject}
        style={{
          marginBottom: 0,
          marginTop: 8,
          opacity: !grade || !subject ? 0.5 : 1,
        }}
      />
    </View>
  );

  const filtersNode = buildFiltersNode(draftGrade, draftSubject);

  const filtersKey = `${draftGrade ?? "all"}|${draftSubject?.value ?? "all"}|${subjects.length}`;

  const openFiltersSheet = () => {
    setDraftGrade(appliedGrade);
    setDraftSubject(appliedSubject);
    const nextFiltersNode = buildFiltersNode(appliedGrade, appliedSubject);
    const nextFiltersKey = `${appliedGrade ?? "all"}|${appliedSubject?.value ?? "all"}|${subjects.length}`;
    openBottomSheet({
      title: "Filters",
      fitToContents: true,
      children: nextFiltersNode,
      contentKey: nextFiltersKey,
    });
  };

  useEffect(() => {
    if (!bottomSheetProps.show || bottomSheetProps.title !== "Filters") return;
    if (bottomSheetProps.contentKey === filtersKey) return;

    setBottomSheetProps((prev) => ({
      ...prev,
      children: filtersNode,
      contentKey: filtersKey,
    }));
  }, [
    bottomSheetProps.contentKey,
    bottomSheetProps.show,
    bottomSheetProps.title,
    filtersKey,
    filtersNode,
    setBottomSheetProps,
  ]);

  const handleSearch = () => {
    setAppliedSearchText(searchText.trim());
    setActiveQueryMode("search");
    setFetchSearch(true);
  };

  const filteredMaterials = useMemo(() => {
    if (activeQueryMode === "search") {
      return searchMaterials;
    }

    if (activeQueryMode === "filter") {
      return filterMaterials;
    }

    return baseMaterials;
  }, [baseMaterials, activeQueryMode, filterMaterials, searchMaterials]);

  const renderItem = ({ item }: { item: LearningMaterial }) => {
    return <LearningMaterialRow item={item} colors={colors} />;
  };

  const isFiltered = Boolean(
    appliedSearchText.trim() || appliedGrade || appliedSubject,
  );
  const loading = baseLoading || searchLoading || filterLoading;
  const isError = baseError || searchError || filterError;

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={filteredMaterials}
        keyExtractor={(item, index) => item.id ?? String(index)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        ListHeaderComponent={
          <View className="pt-4 pb-2">
            <TextInput
              value={searchText}
              onChangeText={(value) => setSearchText(value)}
              placeholder="Search by title"
              contentStyle={{ paddingRight: 52 }}
              left={() => (
                <TouchableOpacity
                  onPress={handleSearch}
                  disabled={!searchText.trim()}
                  style={{ opacity: searchText.trim() ? 1 : 0.5 }}
                  className="h-9 w-9 items-center justify-center rounded-md"
                >
                  <MaterialCommunityIcons
                    name="magnify"
                    size={22}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              )}
              right={() => (
                <TouchableOpacity
                  onPress={openFiltersSheet}
                  className="h-9 w-9 items-center justify-center rounded-md"
                  style={{ backgroundColor: colors.primary }}
                >
                  <MaterialCommunityIcons
                    name="filter-variant"
                    size={22}
                    color="white"
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-16">
            {loading ? (
              <Loading
                loadingText="Loading materials..."
                showLoadingSpin={true}
              />
            ) : isError ? (
              <Text className="text-center text-gray-500" variant="bodyMedium">
                We could not load available materials right now.
              </Text>
            ) : (
              <>
                <Text
                  className="text-center text-gray-800 font-semibold"
                  variant="titleMedium"
                >
                  No materials found
                </Text>
                <Text
                  className="mt-2 text-center text-gray-500"
                  variant="bodyMedium"
                >
                  {isFiltered
                    ? activeQueryMode === "search"
                      ? "Try a different title."
                      : "Try a different grade, or subject."
                    : "Available materials will appear here."}
                </Text>
              </>
            )}
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
