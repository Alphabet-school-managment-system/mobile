import { Index as Loading } from "@/components/loading";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { ModalContext, ModalPropsType } from "@/store/modalContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useContext, useEffect, useMemo, useState } from "react";
import { Modal, ScrollView, View } from "react-native";
import { Text } from "./ui/text";
import { TextInput } from "./ui/textinput";

export const Index = () => {
  const { ModalProps, setModalProps } = useContext(ModalContext);
  const [searchQuery, setSearchQuery] = useState("");

  const searchConfig = ModalProps.search;
  const showSearch = Boolean(searchConfig?.enabled);
  const widthPercent = ModalProps.showLoadingSpin
    ? 50
    : (ModalProps.widthPercent ?? 90);

  useEffect(() => {
    if (!ModalProps.show) {
      setSearchQuery("");
    }
  }, [ModalProps.show]);

  const filteredData = useMemo(() => {
    if (!showSearch || !searchConfig?.data) return searchConfig?.data;

    const query = searchQuery.trim().toLowerCase();
    if (!query) return searchConfig.data;

    if (searchConfig.filterFn) {
      return searchConfig.data.filter((item) =>
        searchConfig.filterFn?.(item, query),
      );
    }

    let valueForItem: (item: any) => string;

    if (typeof searchConfig.filterKey === "function") {
      valueForItem = searchConfig.filterKey;
    } else if (typeof searchConfig.filterKey === "string") {
      valueForItem = (item: any) =>
        String(item?.[searchConfig.filterKey as string]);
    } else {
      valueForItem = (item: any) =>
        String(item?.title ?? item?.label ?? item?.name ?? "");
    }

    return searchConfig.data.filter((item) =>
      valueForItem(item).toLowerCase().includes(query),
    );
  }, [searchConfig, searchQuery, showSearch]);

  const searchResults = useMemo(() => {
    if (!showSearch || !searchConfig?.data || !searchConfig?.renderItem) {
      return null;
    }

    const items = filteredData ?? [];

    if (items.length === 0) {
      return (
        <View className="py-4 items-center">
          <Text className="text-gray-500" variant="bodyMedium">
            {searchConfig.emptyText ?? "No results found"}
          </Text>
        </View>
      );
    }

    return (
      <View>
        {items.map((item, index) => (
          <View
            key={
              searchConfig.keyExtractor
                ? searchConfig.keyExtractor(item, index)
                : `${index}`
            }
          >
            {searchConfig.renderItem?.(item, index)}
          </View>
        ))}
      </View>
    );
  }, [filteredData, searchConfig, showSearch]);

  const contentNode =
    showSearch && searchConfig?.data && searchConfig?.renderItem
      ? searchResults
      : (ModalProps?.content ?? (
          <Loading
            showLoadingSpin={ModalProps?.showLoadingSpin}
            loadingText={ModalProps?.loadingText}
          />
        ));

  return (
    <View>
      <Modal
        visible={ModalProps.show}
        animationType={ModalProps.animationType ?? "fade"}
        transparent={true}
        onRequestClose={() => {
          setModalProps((prev: ModalPropsType) => ({
            ...prev,
            show: false,
          }));
        }}
      >
        <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]">
          <View
            className={`bg-white p-5 rounded-lg ${widthPercent === 50 ? "!w-[30%]" : "!w-[90%]"} !max-h-[50%] `}
          >
            {ModalProps.header?.show === true && (
              <View className="flex flex-row justify-between items-center">
                <Text className="w-4/3" variant="titleMedium">
                  {ModalProps.header.title}
                </Text>
                {ModalProps.header?.showCloseIcon === true && (
                  <TouchableOpacity
                    onPress={() => {
                      setModalProps((prev: ModalPropsType) => ({
                        ...prev,
                        show: false,
                      }));
                    }}
                    className="w-1/4 items-end"
                  >
                    <AntDesign name="close" size={15} color="black" />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {showSearch && (
              <View className="mt-3">
                <TextInput
                  placeholder={searchConfig?.placeholder ?? "Search"}
                  left="magnify"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  dense={true}
                  className="!mb-0"
                />
              </View>
            )}

            <ScrollView
              className="mt-0"
              contentContainerStyle={{ paddingBottom: 8 }}
              keyboardShouldPersistTaps="handled"
            >
              {contentNode}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};
