import MenuRow from "@/components/ui/menuRow";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

import { View } from "react-native";
export default function Index() {
  const resourceMenus = [
    {
      icon: <SimpleLineIcons name="cloud-upload" size={30} color="white" />,
      title: "Upload Resource",
      route: "/(app)/(resource)/newUpload",
    },
    {
      icon: <MaterialIcons name="my-library-books" size={30} color="white" />,
      title: "My Uploads",
      route: "/(app)/(resource)/myUploads",
    },
    {
      icon: <SimpleLineIcons name="docs" size={30} color="white" />,
      title: "Available resources",
      route: "/(app)/(resource)/list",
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <MenuRow
        label="Manage resources for students and staff"
        menus={resourceMenus}
      />
    </View>
  );
}
