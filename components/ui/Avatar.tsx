import { View } from "react-native";
import { Avatar } from "react-native-paper";
import { Text } from "./text";

export const Index = ({
  title,
  image,
  vertical = true,
}: {
  title: string;
  image?: any;
  vertical?: boolean;
}) => {
  return (
    <View
      className={`flex ${vertical ? "flex-col" : "flex-row"} items-center mb-4`}
    >
      <Avatar.Image
        size={25}
        source={image || require("@/assets/images/default-user-avatar.png")}
        className="mr-2 mb-2"
      />
      <Text className="text-slate-900" variant="bodyMedium">
        {title}
      </Text>
    </View>
  );
};
