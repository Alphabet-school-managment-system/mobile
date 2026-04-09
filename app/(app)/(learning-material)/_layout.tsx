import { CustomHeaderOption } from "@/app/(auth)/_layout";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";

export default function LearningMaterialLayout() {
  const backIcon = (
    <Ionicons name="arrow-back-circle-outline" size={35} color="black" />
  );

  const backRoute = "/(app)/(teacher)/learning-material";

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
          title: "Upload Material",
          headerShown: true,
          onBackPress: () => {
            router.back();
          },
        })}
      />
      <Stack.Screen
        name="availableMaterials"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: "Available Materials",
          headerShown: true,
          onBackPress: () => {
            router.replace(backRoute);
          },
        })}
      />
      <Stack.Screen
        name="materialDetail"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: "Material Detail",
          headerShown: true,
          onBackPress: () => {
            router.back();
          },
        })}
      />
    </Stack>
  );
}
