import { Text } from "@/components/ui/text";
import {
  BottomSheetContext,
  type BottomSheetPropsType,
} from "@/store/providers/BottomSheetContext";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { StyleSheet, View } from "react-native";

const SheetBody = ({
  title,
  content,
  children,
  footer,
  containerStyle,
}: Omit<
  BottomSheetPropsType,
  "show" | "fitToContents" | "skipPartiallyExpanded"
>) => {
  return (
    <BottomSheetView style={[styles.sheetBody, containerStyle]}>
      {title ? (
        <Text variant="titleLarge" disableTranslation={true}>
          {title}
        </Text>
      ) : null}

      <View style={styles.contentWrap}>
        {typeof content === "string" ? (
          <Text variant="bodyLarge" disableTranslation={true}>
            {content}
          </Text>
        ) : (
          content
        )}
        {children}
      </View>

      {footer}
    </BottomSheetView>
  );
};

export const Index = () => {
  const { bottomSheetProps, closeBottomSheet } = useContext(BottomSheetContext);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(
    () => (bottomSheetProps.fitToContents ? ["75%"] : ["50%"]),
    [bottomSheetProps.fitToContents],
  );

  const handleClose = useCallback(() => {
    bottomSheetProps?.onClose?.();
    closeBottomSheet();
  }, [bottomSheetProps, closeBottomSheet]);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  useEffect(() => {
    if (bottomSheetProps.show) {
      bottomSheetRef.current?.snapToIndex(0);
      return;
    }

    bottomSheetRef.current?.close();
  }, [bottomSheetProps.show]);

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFillObject}>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enableDynamicSizing={bottomSheetProps.fitToContents}
        enablePanDownToClose={true}
        onClose={handleClose}
        backdropComponent={renderBackdrop}
      >
        <SheetBody
          title={bottomSheetProps.title}
          content={bottomSheetProps.content}
          children={bottomSheetProps.children}
          footer={bottomSheetProps.footer}
          containerStyle={bottomSheetProps.containerStyle}
          onClose={handleClose}
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  sheetBody: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
    gap: 12,
    backgroundColor: "white",
  },
  contentWrap: {
    gap: 8,
  },
  closeButton: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
});

export default Index;
