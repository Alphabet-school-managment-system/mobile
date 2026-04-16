import { useContext } from "react";
import { View } from "react-native";

import Button, { buttonMode } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  ConfirmationModalContext,
  ConfirmationModalPropsType,
  defaultModalProps,
  defaultConfirmationModalProps,
  ModalContext,
} from "@/store/modalContext";

export const Index = () => {
  const { confirmationModalProps, setConfirmationModalProps } = useContext(
    ConfirmationModalContext,
  );
  const { setModalProps } = useContext(ModalContext);

  const closeModal = () => {
    setConfirmationModalProps((prev: ConfirmationModalPropsType) => ({
      ...defaultConfirmationModalProps,
      show: false,
    }));
    setModalProps((prev) => ({
      ...defaultModalProps,
      show: false,
    }));
  };

  const handleCancel = () => {
    confirmationModalProps?.onCancel?.();
    closeModal();
  };

  const handleConfirm = async () => {
    closeModal();
    await confirmationModalProps?.onOk?.();
  };

  return (
    <View className="bg-white p-5 rounded-lg w-full max-w-xl">
      <View className="flex-row justify-between items-center mb-3">
        <Text variant="titleLarge" className="flex-1" disableTranslation={true}>
          {confirmationModalProps.title ?? defaultConfirmationModalProps.title}
        </Text>
        {/* <TouchableOpacity onPress={handleCancel} className="pl-3">
          <AntDesign name="close" size={18} color="black" />
        </TouchableOpacity> */}
      </View>

      <View className="mb-4">
        {typeof confirmationModalProps.content === "string" ||
        typeof confirmationModalProps.content === "undefined" ? (
          <Text
            variant="bodyLarge"
            className="text-gray-600"
            disableTranslation={true}
          >
            {confirmationModalProps.content ??
              defaultConfirmationModalProps.content?.toString()}
          </Text>
        ) : (
          confirmationModalProps.content
        )}
      </View>

      <View className="flex-row items-center justify-end gap-3">
        <Button
          title={
            confirmationModalProps.cancelButtonText ??
            defaultConfirmationModalProps.cancelButtonText ??
            "Cancel"
          }
          onPress={handleCancel}
          mode={buttonMode.OUTLINE}
          tranparent={true}
          textColor="#374151"
          style={{
            marginBottom: 0,
            borderColor: "#d1d5db",
            borderWidth: 1,
            flex: 1,
          }}
          contentStyle={{ height: 48 }}
          labelStyle={{ fontSize: 16 }}
        />
        <Button
          title={
            confirmationModalProps.okButtonText ??
            defaultConfirmationModalProps.okButtonText ??
            "Confirm"
          }
          onPress={handleConfirm}
          style={{ marginBottom: 0, flex: 1 }}
          contentStyle={{ height: 48 }}
          labelStyle={{ fontSize: 16 }}
        />
      </View>
    </View>
  );
};
