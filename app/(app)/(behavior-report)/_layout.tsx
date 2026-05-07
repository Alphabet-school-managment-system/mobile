import { CustomHeaderOption } from "@/app/(auth)/_layout";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { UtilContext } from "@/store/providers/UtilContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";
import { useContext } from "react";

export default function BehaiorLayout() {
  const backIcon = (
    <Ionicons name="arrow-back-circle-outline" size={35} color="black" />
  );

  const backRoute = "/(app)/(teacher)/self-service";

  const { Util } = useContext(UtilContext);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: "My report",
          headerShown: true,
          onBackPress: () => {
            router.replace(backRoute);
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/(app)/(behavior-report)/new")}
            >
              <Ionicons
                name="add-circle-outline"
                size={28}
                color="black"
                style={{ marginRight: 16 }}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="new"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: Util.routeTitle ?? "New Behavior Report",
          headerShown: true,
          onBackPress: () => {
            router.back();
          },
        })}
      />
      <Stack.Screen
        name="[id]"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: "Report Detail",
          headerShown: true,
          onBackPress: () => {
            router.back();
          },
        })}
      />
    </Stack>
  );
}
