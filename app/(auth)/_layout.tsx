import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { Colors } from "@/constants/colors";
import { Index as Loading } from "@/components/loading";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Redirect, router, Stack, useSegments } from "expo-router";
import { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/store/query-client";
import { useContext } from "react";
import { UserContext } from "@/store/userContext";

export const CustomHeaderOption = ({
  title,
  headerShown = true,
  onBackPress,
  backIcon,
  headerRight,
}: {
  title: string;
  headerShown?: boolean;
  onBackPress?: () => void;
  backIcon?: React.ReactNode;
  headerRight?: () => React.ReactNode;
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
        <>
          {backIcon ? (
            backIcon
          ) : (
            <MaterialDesignIcons
              name="arrow-left"
              size={24}
              color={Colors.darkBlack}
            />
          )}
        </>
      </TouchableOpacity>
    ),
    headerRight,
  };
};

export default function AuthLayout() {
  const { userData, isHydrated } = useContext(UserContext);
  const segments = useSegments();
  const currentScreen = segments[segments.length - 1] ?? "";
  const allowedUnauthedScreens = [
    "login",
    "forgetPassword",
    "otp",
    "setNewPassword",
  ];

  if (!isHydrated) {
    return <Loading showLoadingSpin loadingText="Restoring session..." />;
  }

  if (userData?.token) {
    return <Redirect href="/(app)" />;
  }

  if (!userData?.skipOnboarding && currentScreen !== "onBoarding") {
    return <Redirect href="/(auth)/onBoarding" />;
  }

  if (userData?.skipOnboarding && !userData?.role && currentScreen !== "whoAreYou") {
    return <Redirect href="/(auth)/whoAreYou" />;
  }

  if (
    userData?.skipOnboarding &&
    userData?.role &&
    !userData?.token &&
    !allowedUnauthedScreens.includes(currentScreen)
  ) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
