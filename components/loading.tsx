import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Text } from "./ui/text";

export const Index = ({
  showLoadingSpin,
  loadingText,
  className,
}: {
  showLoadingSpin?: boolean;
  loadingText?: string;
  className?: string;
}) => {
  return (
    <View className={`items-center justify-center ${className}`}>
      {showLoadingSpin && <ActivityIndicator size="small" />}
      <Text className="mt-2 text-gray-600" variant="bodyLarge">
        {loadingText}
      </Text>
    </View>
  );
};
