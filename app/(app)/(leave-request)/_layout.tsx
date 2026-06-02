import { CustomHeaderOption } from "@/app/(auth)/_layout";
import { UserContext } from "@/store/providers/UserContext";
import { UtilContext } from "@/store/providers/UtilContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";
import { useContext } from "react";

export default function SelfServiceLayout() {
  const { userData } = useContext(UserContext);

  const backIcon = (
    <Ionicons name="arrow-back-circle-outline" size={35} color="black" />
  );

  const backRoute = "/(app)/(teacher)/self-service";

  const { Util } = useContext(UtilContext);

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: Util.routeTitle ?? "My Leave Requests",
          headerShown: true,
          onBackPress: () => {
            userData?.role === "teacher"
              ? router.replace(backRoute)
              : router.back();
          },
        })}
      />
      <Stack.Screen
        name="new"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: Util.routeTitle ?? "New Leave Request",
          headerShown: true,
          onBackPress: () => {
            userData?.role === "teacher"
              ? router.replace(backRoute)
              : router.back();
          },
        })}
      />
      <Stack.Screen
        name="[id]"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: "Leave Request Detail",
          headerShown: true,
          onBackPress: () => {
            userData?.role === "teacher"
              ? router.replace(backRoute)
              : router.back();
          },
        })}
      />
    </Stack>
  );
}
