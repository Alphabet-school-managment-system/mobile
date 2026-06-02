import FlatList from "@/components/common/flatList";
import Button from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { LeaveRequest, Student } from "@/models";
import { UserContext } from "@/store/providers/UserContext";
import { UtilContext } from "@/store/providers/UtilContext";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useMemo } from "react";
import { View } from "react-native";
import LeaveRequestRow from "../components/LeaveRequestRow";

export type ParamsType = Student & {
  id: string;
  showHeader?: boolean;
};

export default function Index() {
  const { params: stringifiedStudent } = useLocalSearchParams<{
    params?: string;
  }>();

  const parsedParams = useMemo<ParamsType | undefined>(() => {
    if (!stringifiedStudent) return undefined;

    try {
      return JSON.parse(stringifiedStudent) as ParamsType;
    } catch {
      return undefined;
    }
  }, [stringifiedStudent]);

  const { userData } = useContext(UserContext);
  const { setUtil } = useContext(UtilContext);

  const apiEndpoint = `leave-request/search/?${[parsedParams ? "student" : userData?.role]}_id=${parsedParams?.id ?? userData?.id}`;

  useEffect(() => {
    return () => {
      // setUtil({
      //   ...defaultUtilProps,
      // });
    };
  }, []);

  return (
    <FlatList<LeaveRequest>
      apiEndpoint={apiEndpoint}
      renderItem={({ item }: { item: LeaveRequest }) => (
        <LeaveRequestRow item={item} />
      )}
      header={
        parsedParams?.showHeader ? (
          <Button
            title={"New Leave Request"}
            onPress={() => {
              router.push({
                pathname: "/(app)/(leave-request)/new",
                params: {
                  params: JSON.stringify({
                    ...parsedParams,
                    showHeader: true,
                  }),
                },
              });
            }}
          />
        ) : (
          ""
        )
      }
      enableFetch={true}
      emptyDataTitle={
        <View className="mt-4 overflow-hidden ">
          <View className="items-center px-5 py-8">
            <Text className="text-center text-gray-900" variant="titleMedium">
              No leave requests found
            </Text>
            <Text
              className="mt-2 text-center text-gray-500"
              variant="bodyMedium"
            >
              {`We couldn’t find any leave requests for ${parsedParams ? `${parsedParams.first_name} ${parsedParams.last_name}` : "user"}.`}
            </Text>
          </View>
        </View>
      }
    />
  );
}
