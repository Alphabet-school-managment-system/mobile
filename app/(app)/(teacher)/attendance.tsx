import MenuRow from "@/components/ui/menuRow";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { View } from "react-native";
export default function Index() {
  const attendanceMenus = [
    {
      icon: <FontAwesome name="calendar-check-o" size={30} color="white" />,
      title: "Take Attendance",
      route: "/(app)/(attendance)/index",
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <MenuRow label="Manage student attendance" menus={attendanceMenus} />
    </View>
  );
}
