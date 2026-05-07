import { UserContext } from "@/store/providers/UserContext";
import {
    DrawerContentScrollView,
    DrawerItemList,
} from "@react-navigation/drawer";
import Constants from "expo-constants";
import React, { useContext } from "react";
import { Text, View } from "react-native";
import { Avatar } from "react-native-paper";

export default function CustomDrawerContent(props: any) {
  const { userData } = useContext(UserContext);
  const version =
    Constants.expoConfig?.version ||
    Constants.expoConfig?.extra?.version ||
    "1.0.0";
  return (
    <View className="flex-1">
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
        <View className="flex flex-row  items-center mb-4">
          <Avatar.Image
            size={60}
            source={require("@/assets/images/default-user-avatar.png")}
            className="mr-4"
          />
          <Text className="text-2xl font-semibold text-gray-700 ml-2 mt-6 mb-8">
            Welcome, {userData?.first_name || "Teacher"}!
          </Text>
        </View>

        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View className="border-t border-gray-200 p-4 items-center justify-center">
        <Text className="text-lg text-gray-400 mt-2">v{version}</Text>
      </View>
    </View>
  );
}
