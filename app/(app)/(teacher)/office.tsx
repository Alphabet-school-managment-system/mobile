import MenuRow from "@/components/ui/menuRow";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { View } from "react-native";
export default function Index() {
  const officeMenus = [
    {
      icon: <Ionicons name="create-outline" size={30} color="white" />,
      title: "New leave request",
      route: "/(app)/(office)/leaveRequestForm",
    },
    {
      icon: (
        <MaterialCommunityIcons name="list-status" size={30} color="white" />
      ),
      title: "My requests",
      route: "/(app)/(office)/myLeaveRequest",
    },
    {
      icon: <MaterialIcons name="report" size={30} color="white" />,
      title: "Student misconduct report",
      route: "/(app)/(office)/studentMisconductReport",
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <MenuRow
        label="Manage teacher office work remotely instead of in-person availability"
        menus={officeMenus}
      />
    </View>
  );
}
