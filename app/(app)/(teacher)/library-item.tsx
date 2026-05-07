import MenuRow from "@/components/ui/menuRow";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { View } from "react-native";

export default function Index() {
  const libraryMenus = [
    {
      icon: <MaterialCommunityIcons name="bookshelf" size={30} color="white" />,
      title: "Search Items",
      route: "/(app)/(library-item)/index",
    },
    {
      icon: <Octicons name="checklist" size={30} color="white" />,
      title: "My Loans History",
      route: "/(app)/(library-item)/loan",
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <MenuRow
        label="Browse library items and loan history"
        menus={libraryMenus}
      />
    </View>
  );
}
