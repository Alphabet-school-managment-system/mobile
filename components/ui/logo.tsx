import { Colors } from "@/constants/colors";
import { View } from "react-native";
import { Avatar, useTheme } from "react-native-paper";
const logo = require("@/assets/images/logo.png");

export const Index = () => {
  const { colors } = useTheme();

  return (
    <View className="items-center mb-4">
      <Avatar.Image
        size={150}
        source={logo}
        style={{
          borderColor: colors.primary,
          borderWidth: 1,
          backgroundColor: Colors.white,
        }}
      />
    </View>
  );
};
