import { CustomHeaderOption } from "@/app/(auth)/_layout";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";

export default function AttendanceLayout() {
  const backIcon = (
    <Ionicons name="arrow-back-circle-outline" size={35} color="black" />
  );

  const backRoute = "/(app)/(teacher)/attendance";

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="browse"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: "Browse Attendance",
          headerShown: true,
          onBackPress: () => {
            router.replace(backRoute);
          },
        })}
      />
      <Stack.Screen
        name="take"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: "Take Daily Attendance",
          headerShown: true,
          onBackPress: () => {
            router.replace(backRoute);
          },
        })}
      />
    </Stack>
  );
}
