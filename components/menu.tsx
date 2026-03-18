import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { ModalContext, ModalPropsType } from "@/store/modalContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ReactElement, useContext, useEffect } from "react";
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
  icon,
}: {
  items: MenuItemtype[];
  headerTitle: string;
  onClose?: () => void;
  icon?: string | ReactElement;
}) => {
  const { setModalProps } = useContext(ModalContext);

  const modalValues = () => {
    return {
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
                onClose?.();
              }}
            />
          ))}
        </>
      ),
    };
  };

  useEffect(() => {
    if (!items.length) return;

    setModalProps((prev: ModalPropsType) => modalValues());
  }, [headerTitle, items, onClose, setModalProps]);

  return (
    <TouchableOpacity
      onPress={() => {
        setModalProps((prev: ModalPropsType) => ({
          ...modalValues(),
          show: true,
        }));
      }}
    >
      {typeof icon === "string" ? (
        <MaterialCommunityIcons
          name={icon.toString()}
          size={26}
          color="white"
        />
      ) : icon ? (
        icon
      ) : (
        <MaterialCommunityIcons name="dots-vertical" size={26} color="white" />
      )}
    </TouchableOpacity>
  );
};
