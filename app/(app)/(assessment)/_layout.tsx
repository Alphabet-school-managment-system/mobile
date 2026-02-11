import { CustomHeaderOption } from "@/app/(auth)/_layout";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";

export default function AssessmentLayout() {
  const backIcon = (
    <Ionicons name="arrow-back-circle-outline" size={35} color="black" />
  );

  const backRoute = "/(app)/(teacher)/assessment";
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="list"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: "Assessment List",
          headerShown: true,
          onBackPress: () => {
            router.replace(backRoute);
          },
        })}
      />
      <Stack.Screen
        name="form"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: "Create Assessment",
          headerShown: true,
          onBackPress: () => {
            router.replace(backRoute);
          },
        })}
      />
      <Stack.Screen
        name="markbook"
        options={CustomHeaderOption({
          title: "Mark Book",
          backIcon: backIcon,
          headerShown: true,
          onBackPress: () => {
            router.replace(backRoute);
          },
        })}
      />
    </Stack>
  );
}
