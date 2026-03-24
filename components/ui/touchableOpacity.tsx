import { ReactNode } from "react";
import {
  TouchableOpacity as MainTouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

export const Index = ({
  children,
  hitSlop,
  ...props
}: TouchableOpacityProps & {
  children?: ReactNode;
}) => {
  return (
    <MainTouchableOpacity
      hitSlop={
        hitSlop ?? {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        }
      }
      {...props}
    >
      {children}
    </MainTouchableOpacity>
  );
};
