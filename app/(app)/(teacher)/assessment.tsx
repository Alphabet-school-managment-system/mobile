import MenuRow from "@/components/ui/menuRow";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View } from "react-native";
export default function Index() {
  const assessmentMenus = [
    {
      icon: <Ionicons name="create-outline" size={30} color="white" />,
      title: "Create New",
      route: "/(app)/(assessment)/new",
    },
    {
      icon: <MaterialIcons name="assessment" size={30} color="white" />,
      title: "Browse",
      route: "/(app)/(assessment)/index",
    },
    {
      icon: <Entypo name="book" size={30} color="white" />,
      title: "Mark book",
      route: "/(app)/(assessment)/markbook",
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <MenuRow
        label="Manage student assessments and results"
        menus={assessmentMenus}
      />
    </View>
  );
}
