import { UserContext } from "@/store/userContext";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";

export default function AppLayout() {
  const { userData } = useContext(UserContext);
  if (!userData?.skipOnboarding) {
    return <Redirect href="/(auth)/onBoarding" />;
  } else if (!userData?.better_auth_token) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(teacher)" />
      <Stack.Screen name="(student)" />
      <Stack.Screen name="(parent)" />
    </Stack>
  );
}
