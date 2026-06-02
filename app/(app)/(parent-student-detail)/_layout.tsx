import { CustomHeaderOption } from "@/app/(auth)/_layout";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { UtilContext } from "@/store/providers/UtilContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Stack } from "expo-router";
import { useContext } from "react";

export default function Index() {
  const backIcon = (
    <Ionicons name="arrow-back-circle-outline" size={30} color="black" />
  );

  const { Util } = useContext(UtilContext);

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={CustomHeaderOption({
          backIcon: backIcon,
          title: Util?.routeTitle ?? "",
          headerShown: true,
          onBackPress: () => {
            router.back();
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={
                Util.onHeaderRightPress ? Util.onHeaderRightPress : undefined
              }
            >
              <MaterialIcons name="more-vert" size={24} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack>
  );
}
