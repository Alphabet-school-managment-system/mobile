import MenuRow from "@/components/ui/menuRow";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

import { View } from "react-native";
export default function Index() {
  const materialMenus = [
    {
      icon: <SimpleLineIcons name="cloud-upload" size={30} color="white" />,
      title: "Upload Material",
      route: "/(app)/(learning-material)/new",
    },
    {
      icon: <MaterialIcons name="my-library-books" size={30} color="white" />,
      title: "My Uploads",
      route: "/(app)/(learning-material)/my-upload",
    },
    {
      icon: <SimpleLineIcons name="docs" size={30} color="white" />,
      title: "Available materials",
      route: "/(app)/(learning-material)",
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <MenuRow
        label="Manage learning materials for students and staff"
        menus={materialMenus}
      />
    </View>
  );
}
