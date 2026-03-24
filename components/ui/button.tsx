import { Colors } from "@/constants/colors";
import { useTranslation } from "react-i18next";
import { TextStyle, ViewStyle } from "react-native";
import { Button as MainButton, useTheme } from "react-native-paper";

export enum buttonMode {
  CONTAINED = "contained",
  OUTLINE = "outlined",
  ELEVATED = "elevated",
  TEXT = "text",
  CONTAINED_TONAL = "contained-tonal",
}

const Button = ({
  title,
  onPress,
  style,
  contentStyle,
  textColor,
  loading,
  disabled,
  labelStyle,
  className,
  mode = buttonMode.CONTAINED,
  icon,
  tranparent = false,
}: {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  textColor?: string;
  loading?: boolean;
  disabled?: boolean;
  labelStyle?: TextStyle;
  className?: string;
  mode?: buttonMode;
  icon?: any;
  tranparent?: boolean;
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <MainButton
      mode={mode}
      style={{
        marginBottom: 30,
        borderRadius: 10,
        ...style,
      }}
      className={`${tranparent ? "!bg-transparent" : `!bg-[${colors.primary}]`} w-full ${className}`}
      contentStyle={{
        height: 50,
        ...contentStyle,
      }}
      textColor={textColor ?? Colors.white}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      labelStyle={{ fontSize: 20, fontWeight: "bold", ...labelStyle }}
      icon={icon}
      // rippleColor={"#05b05b"}
    >
      {t(title)}
    </MainButton>
  );
};

export default Button;
