import CustomDrawerContent from "@/components/ui/customDrawerContent";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function TeacherLayout() {
  const { colors } = useTheme();
  return (
    <Drawer
      screenOptions={{
        drawerStyle: {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },

        drawerItemStyle: {
          borderRadius: 5,
        },

        drawerLabelStyle: {
          marginLeft: 10,
          fontWeight: "700",
          fontSize: 18,
        },

        drawerActiveBackgroundColor: colors.primary,
        drawerActiveTintColor: "#fff",

        drawerInactiveBackgroundColor: "transparent",
        drawerInactiveTintColor: "#374151",
        headerRight: () => (
          <View className="flex-row mr-5 gap-5">
            <TouchableOpacity onPress={() => console.log("Messages")}>
              <Ionicons name="chatbubble-outline" size={24} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => console.log("Notifications")}>
              <Ionicons name="notifications" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ),
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="office"
        options={{
          title: "Self Service",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="briefcase-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="assessment"
        options={{
          title: "Assessment",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="clipboard-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="attendance"
        options={{
          title: "Attendance",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="resource"
        options={{
          title: "Resource",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="library"
        options={{
          title: "Library",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="library-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="profile"
        options={{
          title: "Profile",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
