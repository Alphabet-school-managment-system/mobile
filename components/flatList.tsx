import { useApiQuery } from "@/hooks/useApi";
import { ReactElement } from "react";
import { ListRenderItem, FlatList as MainFlatList, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Text } from "./ui/text";

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
  const { data, isLoading, isFetching, error } = useApiQuery<any>(
    [apiEndpoint],
    apiEndpoint,
    enableFetch,
  );

  return (
    <View className="flex-1 bg-white px-4 pt-5">
      {header ?? (
        <Text className="mb-3 font-bold" variant="headlineSmall">
          {header}
        </Text>
      )}

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
          <Text className="mt-2 text-gray-600">Loading...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-red-600 text-center" variant="bodyLarge">
            {error instanceof Error ? error.message : "Failed to load"}
          </Text>
        </View>
      ) : (
        <MainFlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item: any, index) => item.id || `${index}`}
          contentContainerStyle={{
            paddingBottom: 20,
            flexGrow: data.length > 0 ? 1 : 0,
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
