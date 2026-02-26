import { Index as Logo } from "@/components/ui/logo";
import { Text } from "@/components/ui/text";
import { UserContext } from "@/store/userContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";

type UserType = {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  value: "student" | "teacher" | "parent";
};

const userTypes: UserType[] = [
  { title: "Student", icon: "school-outline", value: "student" },
  { title: "Teacher", icon: "person-outline", value: "teacher" },
  { title: "Parent", icon: "people-outline", value: "parent" },
];

const Index = () => {
  const { colors } = useTheme();
  const { setUserData } = useContext(UserContext);
  return (
    <View className="flex-1 px-5 justify-center rounded-3xl bg-white mx-4">
      <Logo />
      <View className="flex justify-center items-center">
        <Text
          variant="headlineLarge"
          style={{
            color: colors.primary,
          }}
          className={`font-bold text-center mb-2`}
        >
          Select your account type
        </Text>
        <Text
          variant="titleMedium"
          style={{
            color: colors.primary,
          }}
          className={` mb-8 text-center`}
        >
          Choose how you want to use the app
        </Text>
      </View>
      <View className="gap-4">
        {userTypes.map((user: UserType) => (
          <TouchableOpacity
            key={user.title}
            activeOpacity={0.8}
            style={{ backgroundColor: colors.primary }}
            className="flex items-center gap-3 rounded-xl p-4"
            onPress={() => {
              setUserData((prev: UserDataType) => ({
                ...prev,
                role: user.value,
              }));
              router.push("/(auth)/login");
            }}
          >
            <Ionicons name={user.icon} size={30} color="white" />
            <Text className="text-base font-semibold text-white">
              {user.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Index;
