import { Index as Loading } from "@/components/common/loading";
import { Text } from "@/components/ui/text";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { useApiQuery } from "@/hooks/useApi";
import { LearningMaterial } from "@/models";
import { LearningMaterialFileType } from "@/models/enums";
import { BottomSheetContext } from "@/store/providers/BottomSheetContext";
import { IdsContext } from "@/store/providers/IdContext";
import { UserContext } from "@/store/providers/UserContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useContext, useMemo, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { useTheme } from "react-native-paper";
import { Index as RenderItem } from "../components/LearningMaterialRow";

const formatMaterialTypeLabel = (
  type: LearningMaterialFileType | undefined,
): string => {
  switch (type) {
    case "document":
      return "Document (PDF)";
    case "video":
      return "Video (MP4)";
    default:
      return "";
  }
};

export default function Index() {
  const { Ids } = useContext(IdsContext);
  const { userData } = useContext(UserContext);
  const { colors } = useTheme();
  const { openBottomSheet, closeBottomSheet } = useContext(BottomSheetContext);
  const [selectedType, setSelectedType] = useState<
    LearningMaterialFileType | undefined
  >(undefined);

  const endpoint = useMemo(() => {
    if (!userData?.id) return "";
    const params = new URLSearchParams();
    params.set("uploaded_by", userData?.id);
    if (selectedType) {
      params.set("material_type", selectedType);
      params.set("__and", "material_type");
    }
    return `learning-material/search?${params.toString()}`;
  }, [userData?.id, selectedType]);

  const {
    data: materials = [],
    isLoading,
    isError,
  } = useApiQuery<LearningMaterial[]>(
    ["learning-material", userData?.id ?? "", selectedType ?? "all"],
    endpoint,
    Boolean(endpoint),
  );

  const openTypeFilterSheet = () => {
    openBottomSheet({
      title: "Filter by material type",
      fitToContents: true,
      children: (
        <View className="px-4 pb-4 pt-1">
          {(
            [
              {
                label: "All types",
                value: undefined,
                icon: "format-list-bulleted",
              },
              {
                label: "Document",
                value: "document",
                icon: "file-document-outline",
              },
              {
                label: "Video",
                value: "video",
                icon: "play-box-outline",
              },
            ] as const
          ).map((item) => {
            const active = selectedType === item.value;

            return (
              <TouchableOpacity
                key={item.label}
                onPress={() => {
                  setSelectedType(item.value);
                  closeBottomSheet();
                }}
                className="mb-2 flex-row items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-4"
                style={{
                  borderColor: active ? colors.primary : "#e5e7eb",
                  backgroundColor: active ? "#eff6ff" : "white",
                }}
              >
                <View className="flex-row items-center gap-3">
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={22}
                    color={active ? colors.primary : "#374151"}
                  />
                  <Text
                    className={active ? "text-blue-700" : "text-gray-800"}
                    variant="bodyMedium"
                  >
                    {item.label}
                  </Text>
                </View>
                {active ? (
                  <MaterialCommunityIcons
                    name="check"
                    size={22}
                    color={colors.primary}
                  />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      ),
      onClose: () => closeBottomSheet(),
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white">
        <Loading
          showLoadingSpin={true}
          loadingText="Loading your uploads..."
          className="flex-1"
        />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-center text-gray-700" variant="titleMedium">
          Could not load uploads
        </Text>
        <Text className="mt-2 text-center text-gray-500" variant="bodyMedium">
          Please try again after checking your connection.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: LearningMaterial }) => {
    return <RenderItem item={item} colors={colors} />;
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={materials}
        keyExtractor={(item, index) => item.id ?? String(index)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListHeaderComponent={
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 12 }}
          >
            <TouchableOpacity
              onPress={openTypeFilterSheet}
              className="mb-3 flex-row items-center justify-between rounded-xl border border-gray-300  px-4 py-4"
              style={{
                backgroundColor: colors.primary,
              }}
            >
              <View className="flex-row items-center gap-3 text-white">
                <MaterialCommunityIcons
                  name="filter-variant"
                  size={22}
                  color={"white"}
                />
                <View>
                  <Text className="text-white" variant="bodySmall">
                    Filter by material type
                  </Text>
                  <Text
                    className="text-white text-lg font-extrabold"
                    variant="bodyMedium"
                  >
                    {selectedType === undefined
                      ? "All types"
                      : formatMaterialTypeLabel(selectedType)}
                  </Text>
                </View>
              </View>
              <MaterialCommunityIcons
                name="chevron-down"
                size={24}
                color={"white"}
              />
            </TouchableOpacity>
          </ScrollView>
        }
        ListEmptyComponent={
          <View className="items-center justify-center">
            <Text
              className="text-center text-gray-800 font-semibold"
              variant="titleMedium"
            >
              No uploads yet
            </Text>
            <Text
              className="mt-2 text-center text-gray-500"
              variant="bodyMedium"
            >
              {selectedType === undefined
                ? "Your uploaded materials will appear here."
                : `No ${selectedType ?? ""} uploads found.`}
            </Text>
          </View>
        }
      />
    </View>
  );
}
