import { Redirect, Stack } from "expo-router";

const isLoggedIn = false; // from auth store

export default function AppLayout() {
  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack />;
}
