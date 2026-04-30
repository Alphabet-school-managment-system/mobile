import MenuRow from "@/components/ui/menuRow";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { View } from "react-native";
export default function Index() {
  const selfServiceMenus = [
    {
      icon: <Ionicons name="create-outline" size={30} color="white" />,
      title: "New leave request",
      route: "/(app)/(leave-request)/form",
    },
    {
      icon: (
        <MaterialCommunityIcons name="list-status" size={30} color="white" />
      ),
      title: "My requests",
      route: "/(app)/(leave-request)/list",
    },
    {
      icon: <MaterialIcons name="report" size={30} color="white" />,
      title: "Student behavior report",
      route: "/(app)/(behavior-report)/list",
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <MenuRow
        label="Manage teacher office work remotely instead of in-person availability"
        menus={selfServiceMenus}
      />
    </View>
  );
}
