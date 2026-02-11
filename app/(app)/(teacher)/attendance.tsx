import MenuRow from "@/components/ui/menuRow";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { View } from "react-native";
export default function Index() {
  const attendanceMenus = [
    {
      icon: <FontAwesome name="calendar-check-o" size={30} color="white" />,
      title: "Take Attendance",
      route: "/(app)/(attendance)/form",
    },
    {
      icon: <MaterialCommunityIcons name="view-week" size={30} color="white" />,
      title: "Browse",
      route: "/(app)/(attendance)/list",
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <MenuRow label="Manage student attendance" menus={attendanceMenus} />
    </View>
  );
}
