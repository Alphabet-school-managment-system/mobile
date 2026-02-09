import { Colors } from "@/constants/colors";
import { View } from "react-native";
import { Avatar } from "react-native-paper";
const logo = require("@/assets/images/logo.png");

export const Index = () => {
  return (
    <View className="items-center mb-4">
      <Avatar.Image
        size={150}
        source={logo}
        style={{
          borderColor: Colors.purple,
          borderWidth: 1,
          backgroundColor: Colors.white,
        }}
      />
    </View>
  );
};
