import { CustomHeaderOption } from "@/app/(auth)/_layout";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";

export default function LibraryLayout() {
  const backIcon = (
    <Ionicons name="arrow-back-circle-outline" size={35} color="black" />
  );

  const backRoute = "/(app)/(teacher)/library-item";

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="loan"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: "My Library Loans",
          headerShown: true,
          onBackPress: () => {
            router.replace(backRoute);
          },
        })}
      />
      <Stack.Screen
        name="index"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: "Find Library Items",
          headerShown: true,
          onBackPress: () => {
            router.replace(backRoute);
          },
        })}
      />
      <Stack.Screen
        name="[id]"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: "Library Item Detail",
          headerShown: true,
          onBackPress: () => {
            router.back();
          },
        })}
      />
    </Stack>
  );
}
