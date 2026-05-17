import CustomDrawerContent from "@/components/ui/customDrawerContent";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { UserContext } from "@/store/providers/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { useContext, useEffect } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

export function Index() {
  const { colors } = useTheme();
  const { userData } = useContext(UserContext);

  useEffect(() => {
    console.log("%cSidebarBaseLayout userData", "color: #007acc;", userData);
  }, [userData]);

  const sharedScreens = [
    {
      name: "dashboard",
      title: "Dashboard",
      icon: "home-outline" as const,
    },
    {
      name: "learning-material",
      title: "Learning Materials",
      icon: "book-outline" as const,
    },
    {
      name: "library-item",
      title: "Library",
      icon: "library-outline" as const,
    },
  ];

  const teacherScreens = [
    ...sharedScreens,
    {
      name: "attendance",
      title: "Attendance",
      icon: "calendar-outline" as const,
    },
    {
      name: "assessment",
      title: "Assessment",
      icon: "clipboard-outline" as const,
    },
    {
      name: "self-service",
      title: "Self Service",
      icon: "briefcase-outline" as const,
    },
    {
      name: "teacher-weekly-schedule",
      title: "Weekly Schedule",
      icon: "calendar-outline" as const,
    },
    {
      name: "profile",
      title: "Profile",
      icon: "person-outline" as const,
    },
  ];

  const studentScreens = [
    ...sharedScreens,
    {
      name: "student-weekly-schedule",
      title: "Weekly Schedule",
      icon: "calendar-outline" as const,
    },
    {
      name: "profile",
      title: "Profile",
      icon: "person-outline" as const,
    },
  ];

  const screens =
    userData?.role === "teacher" ? teacherScreens : studentScreens;

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
      {screens.map((screen) => (
        <Drawer.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            drawerIcon: ({ size, color }) => (
              <Ionicons name={screen.icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Drawer>
  );
}
