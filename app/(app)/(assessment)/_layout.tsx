import { CustomHeaderOption } from "@/app/(auth)/_layout";
import { UtilContext } from "@/store/providers/UtilContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";
import { useContext } from "react";

export default function AssessmentLayout() {
  const backIcon = (
    <Ionicons name="arrow-back-circle-outline" size={35} color="black" />
  );

  const backRoute = "/(app)/(teacher)/assessment";
  const { Util } = useContext(UtilContext);

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
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
        name="[id]"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: "Assessment Detail",
          headerShown: true,
          onBackPress: () => {
            router.back();
          },
        })}
      />
      <Stack.Screen
        name="new"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: Util.routeTitle ?? "Create Assessment",
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
