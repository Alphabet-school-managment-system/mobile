import { Index as Loading } from "@/components/common/loading";
import { useApiQuery } from "@/hooks/useApi";
import {
    defaultModalProps,
    ModalContext,
    ModalPropsType,
} from "@/store/providers/ModalContext";
import React, { ReactElement, useContext, useEffect } from "react";
import {
  FlatList as MainFlatList,
  ListRenderItem,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "react-native-paper";
import { Text } from "../ui/text";

export type FlatListProps<T> = {
  apiEndpoint?: string;
  data?: T[];
  header: ReactElement | string;
  renderItem: ListRenderItem<T>;
  enableFetch: boolean;
  emptyDataTitle: string | ReactElement;
  alternateRowStyle?: boolean;
  containerClassName?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyExtractor?: (item: T, index: number) => string;
};

const FlatList = <T,>({
  apiEndpoint,
  data,
  header,
  renderItem,
  enableFetch,
  emptyDataTitle,
  alternateRowStyle = true,
  containerClassName,
  contentContainerStyle,
  keyExtractor,
}: FlatListProps<T>) => {
  const { colors } = useTheme();
  const shouldFetch = enableFetch && !!apiEndpoint && data === undefined;
  const {
    data: fetchedData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useApiQuery<any>([apiEndpoint ?? ""], apiEndpoint ?? "", shouldFetch);

  const listData = data ?? fetchedData ?? [];
  const listError = data !== undefined ? undefined : error;
  const listLoading = data !== undefined ? false : isLoading || isFetching;

  const { setModalProps } = useContext(ModalContext);

  useEffect(() => {
    if (!shouldFetch) return;
    refetch();
  }, [apiEndpoint, refetch, shouldFetch]);

  useEffect(() => {
    if (!shouldFetch) return;
    setModalProps((prev: ModalPropsType) => {
      return {
        ...defaultModalProps,
        show: isFetching,
      };
    });
  }, [isFetching, shouldFetch]);

  const renderItemWithRowStyle: ListRenderItem<T> = (info) => {
    if (!alternateRowStyle) {
      return renderItem(info);
    }

    const element = renderItem(info);
    const isOdd = info.index % 2 === 1;
    const rowStyle = {
      backgroundColor: isOdd ? colors.primary : "white",
      color: isOdd ? "white" : "black",
    };

    if (React.isValidElement(element)) {
      const elementAny = element as React.ReactElement<any>;
      const mergedStyle = [elementAny.props?.style, rowStyle].filter(Boolean);
      const mergedClassName =
        typeof elementAny.props?.className === "string"
          ? `${elementAny.props.className} ${isOdd ? "text-white" : "text-black"}`
          : elementAny.props?.className;

      return React.cloneElement(elementAny, {
        style: mergedStyle,
        className: mergedClassName,
      });
    }

    return <View style={rowStyle}>{element}</View>;
  };

  return (
    <View
      className={`flex-1 bg-white px-4 pt-5 ${containerClassName ?? ""}`}
    >
      {header ?? (
        <Text className="mb-3 font-bold" variant="headlineSmall">
          {header}
        </Text>
      )}

      {listLoading ? (
        <Loading />
      ) : listError ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-red-600 text-center" variant="bodyLarge">
            {listError instanceof Error ? listError.message : "Failed to load"}
          </Text>
        </View>
      ) : (
        <MainFlatList
          data={listData}
          renderItem={renderItemWithRowStyle}
          keyExtractor={keyExtractor ?? ((item: any, index) => item.id || `${index}`)}
          contentContainerStyle={[
            {
              paddingBottom: 20,
              flexGrow: listData?.length > 0 ? 1 : 0,
            },
            contentContainerStyle,
          ]}
          ListEmptyComponent={
            typeof emptyDataTitle === "string" ? (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500" variant="bodyLarge">
                  {emptyDataTitle}
                </Text>
              </View>
            ) : (
              emptyDataTitle
            )
          }
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={10}
          windowSize={7}
          removeClippedSubviews
          extraData={isFetching}
        />
      )}
    </View>
  );
};

export default FlatList;
