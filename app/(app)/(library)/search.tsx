import { renderItemTypeBadge } from "@/app/(app)/(library)/itemTypeBadge";
import {
  CustomDropDown,
  useGradeSectionPicker,
} from "@/components/GradeSectionPicker";
import { Index as Loading } from "@/components/loading";
import { MenuItemtype } from "@/components/menu";
import { Text } from "@/components/ui/text";
import { TextInput } from "@/components/ui/textinput";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { useApiQuery } from "@/hooks/useApi";
import { useUtil } from "@/hooks/useUtil";
import { LibraryItem, selectType } from "@/models";
import { BottomSheetContext } from "@/store/bottomSheetContext";
import { IdsContext } from "@/store/idsContext";
import { UserContext } from "@/store/userContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { useContext, useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";
import RenderFiltersContent from "../(assessment)/markbook/renderFiltersContent";

export default function Index() {
  const { Ids } = useContext(IdsContext);
  const { userData } = useContext(UserContext);
  const {
    openBottomSheet,
    closeBottomSheet,
    bottomSheetProps,
    setBottomSheetProps,
  } = useContext(BottomSheetContext);
  const { colors } = useTheme();
  const { subjects } = useUtil();

  const [searchText, setSearchText] = useState("");
  const [fetchSearch, setFetchSearch] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<
    selectType | undefined
  >();

  const {
    selectedGradeSec,
    gradeMenuItems,
    selectedGradeDisplay,
    showGradeSectionLoading,
  } = useGradeSectionPicker({
    userId: userData?.id,
    academicYearId: Ids?.academicYearId,
    onGradeChange: () => {
      setFetchSearch(false);
    },
    onSectionChange: () => {
      setFetchSearch(false);
    },
  });

  const subjectMenuItems = useMemo<MenuItemtype[]>(() => {
    return [
      {
        title: "All subjects",
        leadingIcon: selectedSubject ? "format-list-bulleted" : "check",
        onPress: () => setSelectedSubject(undefined),
      },
      ...subjects.map((item: selectType) => ({
        title: item.label,
        leadingIcon:
          selectedSubject?.value === item.value ? "check" : "book-outline",
        onPress: () => setSelectedSubject(item),
      })),
    ];
  }, [subjects, selectedSubject]);

  const searchEndpoint = useMemo(() => {
    if (!Ids?.branchId) return "";
    const params = new URLSearchParams();

    params.set("branch_id", Ids.branchId);
    params.set("__and", "branch_id");
    if (searchText.trim()) params.set("title", searchText.trim());
    if (selectedSubject) params.set("subject", selectedSubject.value);
    if (selectedGradeSec?.grade) params.set("grade", selectedGradeSec.grade);
    return `library-item/search/?${params.toString()}`;
  }, [
    Ids?.branchId,
    searchText,
    selectedSubject,
    selectedGradeSec?.grade,
    selectedGradeSec?.section,
  ]);

  const {
    data: searchResults = [],
    isLoading: searchLoading,
    isSuccess: searchLoaded,
    isError: searchError,
  } = useApiQuery<LibraryItem[]>(
    [searchEndpoint],
    searchEndpoint,
    fetchSearch && Boolean(searchEndpoint),
  );

  useEffect(() => {
    if (!fetchSearch) return;
    if (searchLoaded || searchError) {
      setFetchSearch(false);
    }
  }, [fetchSearch, searchLoaded, searchError]);

  const filtersNode = useMemo(
    () => (
      <RenderFiltersContent
        selectedGradeSec={selectedGradeSec}
        selectedGradeDisplay={selectedGradeDisplay}
        gradeMenuItems={gradeMenuItems}
        loadingGrade={showGradeSectionLoading}
        loadingSection={showGradeSectionLoading}
        onApply={() => {
          setFetchSearch(true);
          closeBottomSheet();
        }}
        disableApply={
          !Ids?.branchId ||
          (!selectedGradeSec?.grade && !selectedSubject?.value)
        }
        extraFilterOption={[
          <CustomDropDown
            label="Subject"
            value={selectedSubject?.label}
            placeholder="Select subject"
            menuItems={subjectMenuItems}
            headerTitle="Select Subject"
            showLabel={true}
            menuSearch={{ placeholder: "Search subject" }}
            menuShowCloseIcon={true}
          />,
        ]}
        hideSection={true}
      />
    ),
    [
      closeBottomSheet,
      gradeMenuItems,
      selectedGradeDisplay,
      selectedGradeSec?.grade,
      selectedSubject,
      subjectMenuItems,
      showGradeSectionLoading,
      Ids?.branchId,
    ],
  );

  const filtersKey = `${selectedGradeSec?.grade ?? ""}|${selectedSubject?.value ?? ""}|${subjects.length}|${showGradeSectionLoading ? "g1" : "g0"}`;

  const openFiltersSheet = () => {
    openBottomSheet({
      title: "Filters",
      fitToContents: true,
      children: filtersNode,
      contentKey: filtersKey,
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
    bottomSheetProps.show,
    bottomSheetProps.title,
    bottomSheetProps.contentKey,
    filtersKey,
    filtersNode,
    setBottomSheetProps,
  ]);

  const handleSearch = () => {
    if (!Ids?.branchId) {
      Toast.show({
        type: "info",
        text1: "Select branch",
        text2: "Branch is required to search items.",
      });
      return;
    }
    setFetchSearch(true);
  };

  const renderItem = ({ item }: { item: LibraryItem }) => (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/(app)/(library)/itemDetail",
          params: { item: JSON.stringify(item) },
        });
      }}
      className="border border-gray-200 rounded-lg px-4 py-3 mb-3 flex-row justify-between"
    >
      <View>
        <Text className="text-gray-900 font-semibold" variant="titleMedium">
          {item.title}
        </Text>
        <Text className="text-gray-500" variant="bodySmall">
          {item.author}
        </Text>
      </View>
      <View className="flex items-center justify-center">
        {renderItemTypeBadge(item.item_type)}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={searchResults}
        keyExtractor={(item, index) => item.id ?? String(index)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        ListHeaderComponent={
          <View className="pt-4 pb-0">
            <View className="flex-row items-center">
              <View className="flex-1 relative">
                <TextInput
                  value={searchText}
                  onChangeText={(value) => setSearchText(value)}
                  placeholder="Search by title"
                  contentStyle={{ paddingRight: 44 }}
                  className="mb-0"
                  right={() => (
                    <TouchableOpacity
                      onPress={handleSearch}
                      disabled={!searchText.trim()}
                      style={{ opacity: searchText.trim() ? 1 : 0.5 }}
                    >
                      <MaterialCommunityIcons
                        name="magnify"
                        size={24}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                  )}
                  left={() => (
                    <TouchableOpacity
                      onPress={openFiltersSheet}
                      className={`h-9 w-9 items-center justify-center rounded-md`}
                      style={{
                        backgroundColor: colors.primary,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="filter-variant"
                        size={24}
                        color="white"
                      />
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">
            {searchLoading ? (
              <Loading
                loadingText="Searching library items..."
                showLoadingSpin={true}
              />
            ) : searchLoaded ? (
              <Text className="text-gray-500" variant="bodyMedium">
                No library items found for this search.
              </Text>
            ) : (
              <Text className="text-gray-500" variant="bodyMedium">
                Tap the search icon to find library items.
              </Text>
            )}
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
