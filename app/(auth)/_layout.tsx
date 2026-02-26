import { Colors } from "@/constants/colors";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { router, Stack } from "expo-router";
import { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { TouchableOpacity } from "react-native";

export const CustomHeaderOption = ({
  title,
  headerShown = true,
  onBackPress,
  backIcon,
}: {
  title: string;
  headerShown?: boolean;
  onBackPress?: () => void;
  backIcon?: React.ReactNode;
}): ExtendedStackNavigationOptions => {
  return {
    title: title,
    headerShown: headerShown,
    headerTitleStyle: {
      color: Colors.darkBlack,
    },
    headerTitleAlign: "center",
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => {
          if (onBackPress) {
            onBackPress();
          } else {
            router.back();
          }
        }}
      >
        {backIcon ? (
          backIcon
        ) : (
          <MaterialDesignIcons
            name="arrow-left"
            size={24}
            color={Colors.darkBlack}
          />
        )}
      </TouchableOpacity>
    ),
  };
};

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="onBoarding"
        options={{ title: "On Boarding", headerShown: false }}
      />
      <Stack.Screen
        name="whoAreYou"
        options={{ title: "Who Are You", headerShown: false }}
      />

      <Stack.Screen
        name="login"
        options={{ title: "Login", headerShown: false }}
      />
      <Stack.Screen
        name="forgetPassword"
        options={{ title: "Forget Password", headerShown: false }}
      />
      <Stack.Screen
        name="otp"
        options={CustomHeaderOption({
          title: "OTP Verification",
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="setNewPassword"
        options={CustomHeaderOption({
          title: "Set New Password",
          headerShown: false,
        })}
      />
    </Stack>
  );
}
