import { CustomHeaderOption } from "@/app/(auth)/_layout";
import { UtilContext } from "@/store/utilContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";
import { useContext } from "react";

export default function SelfServiceLayout() {
  const backIcon = (
    <Ionicons name="arrow-back-circle-outline" size={35} color="black" />
  );

  const backRoute = "/(app)/(teacher)/self-service";

  const { Util } = useContext(UtilContext);

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="list"
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
        name="form"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: Util.routeTitle ?? "New Leave Request",
          headerShown: true,
          onBackPress: () => {
            router.replace(backRoute);
          },
        })}
      />
      <Stack.Screen
        name="detail"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: "Leave Request Detail",
          headerShown: true,
          onBackPress: () => {
            router.replace("/(app)/(leave-request)/list");
          },
        })}
      />
    </Stack>
  );
}
