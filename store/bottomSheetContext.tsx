import React, {
  createContext,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { type StyleProp, type ViewStyle } from "react-native";

export type BottomSheetPropsType = {
  show: boolean;
  title?: string | ReactElement;
  content?: string | ReactElement;
  contentKey?: string;
  children?: ReactElement;
  footer?: ReactElement;
  containerStyle?: StyleProp<ViewStyle>;
  fitToContents?: boolean;
  skipPartiallyExpanded?: boolean;
  onClose?: () => void;
};

export type BottomSheetContextType = {
  bottomSheetProps: BottomSheetPropsType;
  setBottomSheetProps: React.Dispatch<
    React.SetStateAction<BottomSheetPropsType>
  >;
  openBottomSheet: (props?: Partial<BottomSheetPropsType>) => void;
  closeBottomSheet: () => void;
};

export const defaultBottomSheetProps: BottomSheetPropsType = {
  show: false,
  title: undefined,
  content: undefined,
  contentKey: undefined,
  children: undefined,
  footer: undefined,
  containerStyle: undefined,
  fitToContents: false,
  skipPartiallyExpanded: false,
  onClose: undefined,
};

export const BottomSheetContext = createContext<BottomSheetContextType>({
  bottomSheetProps: defaultBottomSheetProps,
  setBottomSheetProps: () => {},
  openBottomSheet: () => {},
  closeBottomSheet: () => {},
});

export const BottomSheetProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bottomSheetProps, setBottomSheetProps] =
    useState<BottomSheetPropsType>({
      ...defaultBottomSheetProps,
    });

  const openBottomSheet = (props?: Partial<BottomSheetPropsType>) => {
    setBottomSheetProps((prev: BottomSheetPropsType) => ({
      ...prev,
      ...props,
      show: true,
    }));
  };

  const closeBottomSheet = () => {
    setBottomSheetProps((prev: BottomSheetPropsType) => ({
      ...prev,
      show: false,
      title: undefined,
      content: undefined,
      children: undefined,
      footer: undefined,
      containerStyle: undefined,
      fitToContents: false,
      skipPartiallyExpanded: false,
      onClose: undefined,
      contentKey: undefined,
    }));
  };

  return (
    <BottomSheetContext.Provider
      value={{
        bottomSheetProps,
        setBottomSheetProps,
        openBottomSheet,
        closeBottomSheet,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};
