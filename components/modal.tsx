import { Index as Loading } from "@/components/loading";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { ModalContext, ModalPropsType } from "@/store/modalContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useContext } from "react";
import { Modal, View } from "react-native";
import { Text } from "./ui/text";

export const Index = () => {
  const { ModalProps, setModalProps } = useContext(ModalContext);

  return (
    <View>
      <Modal
        visible={ModalProps.show}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setModalProps((prev: ModalPropsType) => ({
            ...prev,
            show: false,
          }));
        }}
      >
        <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]">
          <View className="bg-white p-5 rounded-lg">
            {ModalProps.header?.show === true && (
              <View className="flex flex-row justify-between items-center">
                <Text className="w-4/3" variant="titleMedium">
                  {ModalProps.header.title}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setModalProps((prev: ModalPropsType) => ({
                      ...prev,
                      show: false,
                    }));
                  }}
                  className="w-1/4 items-end"
                >
                  <AntDesign name="close" size={18} color="black" />
                </TouchableOpacity>
              </View>
            )}
            {ModalProps?.content ?? (
              <Loading
                showLoadingSpin={ModalProps?.showLoadingSpin}
                loadingText={ModalProps?.loadingText}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
