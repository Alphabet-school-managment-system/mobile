import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import {
    ModalContext,
    ModalPropsType,
    type ModalSearchConfig,
} from "@/store/providers/ModalContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ReactElement, useContext, useMemo } from "react";
import { Menu } from "react-native-paper";

export type MenuItemtype = {
  title: string;
  leadingIcon: string;
  onPress: (item: any) => void;
};

export type MenuSearchConfig = Omit<ModalSearchConfig, "data" | "renderItem">;

export const Index = ({
  items,
  headerTitle,
  onClose,
  icon,
  disabled,
  search,
  showCloseIcon = false,
}: {
  items: MenuItemtype[];
  headerTitle: string;
  onClose?: () => void;
  icon?: string | ReactElement;
  disabled?: boolean;
  search?: MenuSearchConfig;
  showCloseIcon?: boolean;
}) => {
  const { setModalProps } = useContext(ModalContext);

  const searchEnabled = search ? (search.enabled ?? true) : false;

  const modalValues = useMemo(
    () => ({
      show: false,
      showLoadingSpin: false,
      header: {
        show: true,
        title: headerTitle,
        showCloseIcon,
      },
      search: searchEnabled
        ? {
            enabled: true,
            placeholder: search?.placeholder,
            filterKey: search?.filterKey,
            filterFn: search?.filterFn,
            keyExtractor: search?.keyExtractor,
            emptyText: search?.emptyText,
            data: items,
            renderItem: (item: MenuItemtype) => (
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
            ),
          }
        : undefined,
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
    }),
    [
      headerTitle,
      items,
      onClose,
      search?.emptyText,
      search?.filterFn,
      search?.filterKey,
      search?.keyExtractor,
      search?.placeholder,
      searchEnabled,
      showCloseIcon,
      setModalProps,
    ],
  );

  return (
    <TouchableOpacity
      onPress={() => {
        setModalProps((prev: ModalPropsType) => ({
          ...modalValues,
          show: true,
        }));
      }}
      disabled={disabled}
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
