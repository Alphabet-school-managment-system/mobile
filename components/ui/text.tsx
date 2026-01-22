import { isTranslationKeyValid } from "@/i18n/translationUtil";
import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, Text, TextStyle } from "react-native";

const CustomText = ({
  children,
  disableTranslation,
  onPress,
  style = {},
  className,
}: {
  children: ReactNode;
  disableTranslation?: boolean;
  onPress?: () => void;
  style?: StyleProp<TextStyle> | undefined;
  className?: string;
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (disableTranslation) {
      return;
    }
    if (!isTranslationKeyValid(children)) {
      console.warn(`Translation key "${children}" not found in en.json`);
    }
  }, [disableTranslation, children]);
  return (
    <Text
      style={[style]}
      className={`text-black ${className}`}
      onPress={onPress}
    >
      {disableTranslation ? children : t(children?.toString() ?? "")}
    </Text>
  );
};
export { CustomText as Text };
