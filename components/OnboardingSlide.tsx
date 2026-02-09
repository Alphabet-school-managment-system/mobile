import { OnboardingSlide as SlideType } from "@/data/OnboardingData";
import React from "react";
import { Image, useWindowDimensions, View } from "react-native";
import { Text } from "react-native-paper";

interface OnboardingSlideProps {
  item: SlideType;
}

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ item }) => {
  const { width } = useWindowDimensions();

  return (
    <View
      // style={{
      //   flex: 1,
      //   alignItems: "center",
      //   justifyContent: "center",
      //   padding: 20,
      //   width,
      // }}
    >
      <Text
        variant="headlineMedium"
        style={{ color: "#4CAF50", marginBottom: 16, textAlign: "center" }}
      >
        {item.title}
      </Text>
      <Image
        source={item.image}
        style={{ height: 300, width: 300, marginBottom: 30, borderRadius: 12 }}
        resizeMode="contain"
        onError={() => {}}
      />
      <Text variant="bodyLarge" style={{ color: "#666", textAlign: "center" }}>
        {item.description}
      </Text>
    </View>
  );
};

export default OnboardingSlide;
