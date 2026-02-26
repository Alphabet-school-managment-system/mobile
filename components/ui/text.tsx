import { isTranslationKeyValid } from "@/i18n/translationUtil";
import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, Text, TextStyle } from "react-native";
export type TextVariant =
  | "displayLarge"
  | "displayMedium"
  | "displaySmall"
  | "headlineLarge"
  | "headlineMedium"
  | "headlineSmall"
  | "titleLarge"
  | "titleMedium"
  | "titleSmall"
  | "labelLarge"
  | "labelMedium"
  | "labelSmall"
  | "bodyLarge"
  | "bodyMedium"
  | "bodySmall";

const CustomText = ({
  children,
  disableTranslation,
  onPress,
  style = {},
  className,
  variant,
}: {
  children: ReactNode;
  disableTranslation?: boolean;
  onPress?: () => void;
  style?: StyleProp<TextStyle> | undefined;
  className?: string;
  variant?: TextVariant;
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (disableTranslation) {
      return;
    }
    if (!isTranslationKeyValid(children)) {
      // console.warn(`Translation key "${children}" not found in en.json`);
    }
  }, [disableTranslation, children]);

  const variantStyles: Record<TextVariant, TextStyle> = {
    displayLarge: { fontSize: 57, fontWeight: "400" },
    displayMedium: { fontSize: 45, fontWeight: "400" },
    displaySmall: { fontSize: 36, fontWeight: "400" },
    headlineLarge: { fontSize: 32, fontWeight: "400" },
    headlineMedium: { fontSize: 28, fontWeight: "400" },
    headlineSmall: { fontSize: 24, fontWeight: "400" },
    titleLarge: { fontSize: 22, fontWeight: "500" },
    titleMedium: { fontSize: 16, fontWeight: "500" },
    titleSmall: { fontSize: 14, fontWeight: "500" },
    labelLarge: { fontSize: 14, fontWeight: "500" },
    labelMedium: { fontSize: 12, fontWeight: "500" },
    labelSmall: { fontSize: 11, fontWeight: "500" },
    bodyLarge: { fontSize: 16, fontWeight: "400" },
    bodyMedium: { fontSize: 14, fontWeight: "400" },
    bodySmall: { fontSize: 12, fontWeight: "400" },
  };

  const appliedVariant = variant ?? "titleMedium";

  return (
    <Text
      style={[variantStyles[appliedVariant], style]}
      className={`text-black ${className}`}
      onPress={onPress}
    >
      {disableTranslation ? children : t(children?.toString() ?? "")}
    </Text>
  );
};
export { CustomText as Text };
