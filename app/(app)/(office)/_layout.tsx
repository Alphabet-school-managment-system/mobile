import { CustomHeaderOption } from "@/app/(auth)/_layout";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";

export default function OfficeLayout() {
  const backIcon = (
    <Ionicons name="arrow-back-circle-outline" size={35} color="black" />
  );

  const backRoute = "/(app)/(teacher)/office";

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="myLeaveRequest"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: "My requests",
          headerShown: true,
          onBackPress: () => {
            router.replace(backRoute);
          },
        })}
      />
      <Stack.Screen
        name="newLeaveRequest"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: "New Leave Request",
          headerShown: true,
          onBackPress: () => {
            router.replace(backRoute);
          },
        })}
      />
      <Stack.Screen
        name="studentMisconductReport"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: "Student Misconduct Report",
          headerShown: true,
          onBackPress: () => {
            router.replace(backRoute);
          },
        })}
      />
    </Stack>
  );
}
