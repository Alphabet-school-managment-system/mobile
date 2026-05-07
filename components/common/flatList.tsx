import { Index as Loading } from "@/components/common/loading";
import { useApiQuery } from "@/hooks/useApi";
import {
    defaultModalProps,
    ModalContext,
    ModalPropsType,
} from "@/store/providers/ModalContext";
import React, { ReactElement, useContext, useEffect } from "react";
import { ListRenderItem, FlatList as MainFlatList, View } from "react-native";
import { useTheme } from "react-native-paper";
import { Text } from "../ui/text";

export type FlatListProps<T> = {
  apiEndpoint: string;
  header: ReactElement | string;
  renderItem: ListRenderItem<T>;
  enableFetch: boolean;
  emptyDataTitle: string;
};

const FlatList = <T,>({
  apiEndpoint,
  header,
  renderItem,
  enableFetch,
  emptyDataTitle,
}: FlatListProps<T>) => {
  const { colors } = useTheme();
  const { data, isLoading, isFetching, error, refetch } = useApiQuery<any>(
    [apiEndpoint],
    apiEndpoint,
    enableFetch && !!apiEndpoint,
  );

  const { setModalProps } = useContext(ModalContext);

  useEffect(() => {
    refetch();
  }, [apiEndpoint]);

  useEffect(() => {
    setModalProps((prev: ModalPropsType) => {
      return {
        ...defaultModalProps,
        show: isFetching,
      };
    });
  }, [isFetching]);

  const renderItemWithRowStyle: ListRenderItem<T> = (info) => {
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
    <View className="flex-1 bg-white px-4 pt-5">
      {header ?? (
        <Text className="mb-3 font-bold" variant="headlineSmall">
          {header}
        </Text>
      )}

      {isFetching ? (
        <Loading />
      ) : error ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-red-600 text-center" variant="bodyLarge">
            {error instanceof Error ? error.message : "Failed to load"}
          </Text>
        </View>
      ) : (
        <MainFlatList
          data={data}
          renderItem={renderItemWithRowStyle}
          keyExtractor={(item: any, index) => item.id || `${index}`}
          contentContainerStyle={{
            paddingBottom: 20,
            flexGrow: data?.length > 0 ? 1 : 0,
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-500" variant="bodyLarge">
                {emptyDataTitle}
              </Text>
            </View>
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
