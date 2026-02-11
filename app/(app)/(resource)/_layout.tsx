import { CustomHeaderOption } from "@/app/(auth)/_layout";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";

export default function ResourceLayout() {
  const backIcon = (
    <Ionicons name="arrow-back-circle-outline" size={35} color="black" />
  );

  const backRoute = "/(app)/(teacher)/resource";

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="myUploads"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: "My Uploads",
          headerShown: true,
          onBackPress: () => {
            router.replace(backRoute);
          },
        })}
      />
      <Stack.Screen
        name="newUpload"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: "Upload Resource",
          headerShown: true,
          onBackPress: () => {
            router.replace(backRoute);
          },
        })}
      />
      <Stack.Screen
        name="list"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: "Available Resources",
          headerShown: true,
          onBackPress: () => {
            router.replace(backRoute);
          },
        })}
      />
    </Stack>
  );
}
