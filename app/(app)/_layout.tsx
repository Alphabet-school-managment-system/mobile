import { UserContext } from "@/store/userContext";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";

const isLoggedIn = false;

export default function AppLayout() {
  const { userData } = useContext(UserContext);
  if (!userData?.skipOnboarding) {
    return <Redirect href="/(auth)/onBoarding" />;
  } else if (!userData?.token) {
    return <Redirect href="/(auth)/login" />;
  } else if (userData?.role === "teacher") {
    return <Redirect href="/(app)/(teacher)/dashboard" />;
  } else if (userData?.role === "student") {
    return <Redirect href="/(app)/(student)" />;
  } else if (userData?.role === "parent") {
    return <Redirect href="/(app)/(parent)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(teacher)" />
      <Stack.Screen name="(student)" />
      <Stack.Screen name="(parent)" />
    </Stack>
  );
}
