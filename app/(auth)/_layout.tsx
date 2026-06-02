import { Index as Loading } from "@/components/common/loading";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { Colors } from "@/constants/colors";
import { UserContext } from "@/store/providers/UserContext";
import { queryClient } from "@/store/query/query-client";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { QueryClientProvider } from "@tanstack/react-query";
import { Redirect, router, Stack, useSegments } from "expo-router";
import { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { useContext } from "react";

export const CustomHeaderOption = ({
  title,
  headerShown = true,
  onBackPress,
  backIcon,
  headerRight,
  showBackIcon = true,
}: {
  title: string;
  headerShown?: boolean;
  onBackPress?: () => void;
  backIcon?: React.ReactNode;
  headerRight?: () => React.ReactNode;
  showBackIcon?: boolean;
}): ExtendedStackNavigationOptions => {
  return {
    title: title,
    headerShown: headerShown,
    headerTitleStyle: {
      color: Colors.darkBlack,
    },
    headerTitleAlign: "center",
    headerLeft: showBackIcon
      ? () => (
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
        )
      : undefined,
    headerRight,
  };
};

export default function AuthLayout() {
  const { userData, isHydrated } = useContext(UserContext);
  const segments = useSegments();
  const currentScreen = segments[segments.length - 1] ?? "";
  const allowedUnauthedScreens = [
    "login",
    "forget-password",
    "otp",
    "set-new-password",
  ];

  if (!isHydrated) {
    return <Loading showLoadingSpin loadingText="Restoring session..." />;
  }

  if (userData?.token) {
    return <Redirect href="/(app)" />;
  }

  if (!userData?.skipOnboarding && currentScreen !== "onboarding") {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (
    userData?.skipOnboarding &&
    !userData?.role &&
    currentScreen !== "who-are-you"
  ) {
    return <Redirect href="/(auth)/who-are-you" />;
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
          name="onboarding"
          options={{ title: "On Boarding", headerShown: false }}
        />
        <Stack.Screen
          name="who-are-you"
          options={{ title: "Who Are You", headerShown: false }}
        />

        <Stack.Screen
          name="login"
          options={{ title: "Login", headerShown: false }}
        />
        <Stack.Screen
          name="forget-password"
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
          name="set-new-password"
          options={CustomHeaderOption({
            title: "Set New Password",
            headerShown: false,
          })}
        />
      </Stack>
    </QueryClientProvider>
  );
}
