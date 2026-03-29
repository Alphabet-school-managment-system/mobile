"use client";

import React, {
  createContext,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

// confirmation modal
export type ConfirmationModalPropsType = {
  show?: boolean;
  title?: string;
  content?: string | ReactElement;
  okButtonText?: string;
  cancelButtonText?: string;
  onOk: () => void;
  onCancel: () => void;
};

export type ConfirmationModalContextType = {
  confirmationModalProps: ConfirmationModalPropsType;
  setConfirmationModalProps: React.Dispatch<
    React.SetStateAction<ConfirmationModalPropsType>
  >;
};

export const ConfirmationModalContext =
  createContext<ConfirmationModalContextType>({
    confirmationModalProps: {
      title: "",
      content: "",
      okButtonText: "",
      cancelButtonText: "",
      show: false,
      onOk: () => {},
      onCancel: () => {},
    },
    setConfirmationModalProps: () => {},
  });

export const defaultConfirmationModalProps: ConfirmationModalPropsType = {
  title: "Confirmation",
  content: "Are you sure want to delete this item ?",
  okButtonText: "Yes, delete",
  cancelButtonText: "No, leave it that.",
  show: false,
  onOk: () => {},
  onCancel: () => {},
};

export const ConfirmationModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [confirmationModalProps, setConfirmationModalProps] =
    useState<ConfirmationModalPropsType>({
      ...defaultConfirmationModalProps,
    });

  return (
    <ConfirmationModalContext.Provider
      value={{ confirmationModalProps, setConfirmationModalProps }}
    >
      {children}
    </ConfirmationModalContext.Provider>
  );
};

// normal modal
export type ModalSearchConfig = {
  enabled?: boolean;
  placeholder?: string;
  data?: any[];
  filterKey?: string | ((item: any) => string);
  filterFn?: (item: any, query: string) => boolean;
  renderItem?: (item: any, index: number) => ReactElement;
  keyExtractor?: (item: any, index: number) => string;
  emptyText?: string;
};

export type ModalPropsType = {
  showLoadingSpin?: boolean;
  loadingText?: string;
  content?: string | ReactElement;
  show: boolean;
  widthPercent?: number;
  header?: {
    show?: boolean;
    title?: string;
    showCloseIcon?: boolean;
  };
  animationType?: "fade" | "slide" | "none";
  search?: ModalSearchConfig;
};

export type ModalContextType = {
  ModalProps: ModalPropsType;
  setModalProps: React.Dispatch<React.SetStateAction<ModalPropsType>>;
};

export const ModalContext = createContext<ModalContextType>({
  ModalProps: {
    showLoadingSpin: true,
    loadingText: "Loading...",
    content: undefined,
    show: false,
    widthPercent: 90,
    header: {
      show: false,
      title: undefined,
      showCloseIcon: false,
    },
    animationType: "none",
  },
  setModalProps: () => {},
});

export const defaultModalProps: ModalPropsType = {
  showLoadingSpin: true,
  loadingText: "Loading...",
  content: undefined,
  show: false,
  widthPercent: 90,
  header: {
    show: false,
    title: undefined,
    showCloseIcon: false,
  },
  animationType: "none",
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [ModalProps, setModalProps] = useState<ModalPropsType>({
    ...defaultModalProps,
  });

  return (
    <ModalContext.Provider value={{ ModalProps, setModalProps }}>
      {children}
    </ModalContext.Provider>
  );
};
