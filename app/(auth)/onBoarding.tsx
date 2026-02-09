import Button from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/colors";
import { UserContext, UserDataType } from "@/store/userContext";
import { router } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { onboardingSlides } from "../../data/OnboardingData";

const Index = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const { width } = useWindowDimensions();
  const [islastlastIndexReached, setislastlastIndexReached] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUserData } = useContext(UserContext);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index ?? 0);
  }).current;

  const scrollTo = () => {
    if (currentIndex < onboardingSlides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      setUserData((prev: UserDataType) => ({
        ...prev,
        skipOnboarding: true,
      }));

      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        router.push("/login");
      }, 500);
    }
  };

  useEffect(() => {
    if (currentIndex === onboardingSlides.length - 1) {
      setislastlastIndexReached(true);
    } else {
      setislastlastIndexReached(false);
    }
  }, [currentIndex]);

  const renderSlide = ({ item }: any) => (
    <View
      style={{ width }}
      className="flex-1 items-center justify-between px-10 py-20"
    >
      {/* Top Section: Title */}
      <View>
        <Text
          className={`text-[26px] !not-sr-onlyfont-extrabold text-center`}
          variant="headlineMedium"
          style={{ fontWeight: "600", color: Colors.purple }}
        >
          {item.title}
        </Text>
      </View>

      {/* Middle Section: Image */}
      <View className="w-full aspect-square items-center justify-center">
        <Image
          source={item.image}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </View>

      {/* Bottom Section: Description */}
      <Text
        className="leading-10 text-center text-gray-600"
        variant="titleLarge"
      >
        {item.description}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 rounded-3xl">
        {/* Slides */}
        <View className="h-3/4">
          <FlatList
            data={onboardingSlides}
            renderItem={renderSlide}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false },
            )}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            ref={slidesRef}
          />
        </View>
        <View className="h-1/4 justify-center">
          {/* Footer */}
          <View className=" w-full px-6">
            {/* Button */}
            <Button
              onPress={scrollTo}
              className={`${islastlastIndexReached ? "" : "!bg-gray-500/30"}`}
              title={islastlastIndexReached ? "Continue" : "Next"}
              textColor={islastlastIndexReached ? Colors.white : Colors.white}
              loading={loading}
            />
            {/* Pagination */}
            <View className="flex-row justify-center mb-6">
              {onboardingSlides.map((_, index) => {
                const inputRange = [
                  (index - 1) * width,
                  index * width,
                  (index + 1) * width,
                ];

                const dotWidth = scrollX.interpolate({
                  inputRange,
                  outputRange: [8, 16, 8],
                  extrapolate: "clamp",
                });

                return (
                  <Animated.View
                    key={index}
                    className={`h-2 rounded-full mx-1`}
                    style={{
                      width: dotWidth,
                      opacity: index === currentIndex ? 1 : 0.7,
                      backgroundColor: Colors.purple,
                    }}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Index;
