import { ModalContext, ModalPropsType } from "@/store/modalContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useContext, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Menu } from "react-native-paper";

export type MenuItemtype = {
  title: string;
  leadingIcon: string;
  onPress: (item: any) => void;
};

export const Index = ({
  items,
  headerTitle,
  onClose,
}: {
  items: MenuItemtype[];
  headerTitle: string;
  onClose?: () => void;
}) => {
  const { setModalProps } = useContext(ModalContext);

  useEffect(() => {
    if (!items.length) return;

    setModalProps((prev: ModalPropsType) => ({
      ...prev,
      show: false,
      showLoadingSpin: false,
      header: {
        show: true,
        title: headerTitle,
      },
      content: (
        <>
          {items.map((item: MenuItemtype) => (
            <Menu.Item
              key={item.title}
              title={item.title}
              leadingIcon={item.leadingIcon}
              onPress={async () => {
                await item?.onPress?.(item);
                setModalProps((prev: ModalPropsType) => ({
                  ...prev,
                  show: false,
                }));
              }}
            />
          ))}
        </>
      ),
    }));
  }, [items]);

  return (
    <TouchableOpacity
      onPress={() => {
        setModalProps((prev: ModalPropsType) => ({
          ...prev,
          show: true,
        }));
      }}
    >
      <MaterialCommunityIcons name="dots-vertical" size={26} color="white" />
    </TouchableOpacity>
  );
};
