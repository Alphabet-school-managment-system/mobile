import { UserContext } from "@/store/userContext";
import { Index as Loading } from "@/components/loading";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/store/query-client";

export default function AppLayout() {
  const { userData, isHydrated } = useContext(UserContext);

  if (!isHydrated) {
    return <Loading showLoadingSpin loadingText="Restoring session..." />;
  }

  if (!userData?.skipOnboarding) {
    return <Redirect href="/(auth)/onBoarding" />;
  }

  if (!userData?.role) {
    return <Redirect href="/(auth)/whoAreYou" />;
  }

  if (!userData?.token) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(teacher)" />
        <Stack.Screen name="(student)" />
        <Stack.Screen name="(parent)" />
      </Stack>
    </QueryClientProvider>
  );
}
