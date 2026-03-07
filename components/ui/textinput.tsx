import { Colors } from "@/constants/colors";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardTypeOptions,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import { HelperText, TextInput as MainTextInput } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import dayjs from "dayjs";
import { FlexStyle } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";
import { scale } from "react-native-size-matters";
import { Text } from "./text";

export enum textInputMode {
  FLAT = "flat",
  OUTLINE = "outlined",
}

export interface TextInputPropsType extends FlexStyle {
  value?: string | any;
  onChangeText?: (value: any) => void;
  secureTextEntry?: boolean;
  style?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<TextStyle>;
  outlineStyle?: StyleProp<ViewStyle>;
  left?: any;
  right?: any;
  keyboardType?: KeyboardTypeOptions;
  mode?: textInputMode;
  placeholder?: string;
  textColor?: string;
  error?: boolean;
  errorMessage?: string;
  autoFocus?: boolean;
  maxLength?: number;
  ref?: any;
  className?: string;
  disabled?: boolean;
  label?: string;
  labelStyle?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

function TextInputProps(props: TextInputPropsType) {
  const {
    secureTextEntry,
    style,
    contentStyle,
    outlineStyle,
    left,
    right,
    keyboardType,
    mode = "outlined",
    placeholder,
    textColor = Colors.grey,
    error = false,
    errorMessage,
    autoFocus,
    maxLength,
    ref,
    className,
    value,
    disabled = false,
    label,
    labelStyle,
    multiline = false,
    numberOfLines,
  } = props;

  return {
    mode: mode as textInputMode,
    secureTextEntry,
    keyboardType,
    style: {
      fontSize: scale(18),
      width: "100%" as unknown as number,
      justifyContent: "center" as "center",
      backgroundColor: Colors.extremLightGrey,
      borderColor: "#D1D5DB",
      marginTop: 10,
      ...(StyleSheet.flatten(style) || {}),
    },
    contentStyle: {
      height: 50,
      ...(StyleSheet.flatten(contentStyle) || {}),
    },
    outlineStyle: {
      borderColor: Colors.grey,
      borderWidth: 1,
      borderRadius: 7,
      height: 50,
      width: "100%" as unknown as number,
      ...(StyleSheet.flatten(outlineStyle) || {}),
    },
    left: left ? (
      <MainTextInput.Icon icon={left} size={scale(20)} color={Colors.grey} />
    ) : null,
    right: right ? (
      <MainTextInput.Icon icon={right} size={scale(20)} color={Colors.grey} />
    ) : null,
    textColor,
    placeholder: placeholder,
    placeholderTextColor: textColor,
    error,
    className: `rounded-lg items-center justify-center mb-3 ${className}`,
    autoFocus,
    maxLength,
    ref,
    value,
    errorMessage,
    disabled: disabled,
    label,
    labelStyle,
    multiline,
    numberOfLines,
  };
}

export const TextInput = (props: TextInputPropsType) => {
  const [inputValue, setInputValue] = useState(props?.value);
  const { t } = useTranslation();

  useEffect(() => {
    setInputValue(props?.value);
  }, [props?.value]);

  const result: TextInputPropsType = TextInputProps({
    ...props,
    value: inputValue,
    placeholder: props?.placeholder && t(props?.placeholder).toString(),
  });

  delete result.label;

  return (
    <>
      {props?.label && (
        <Text
          className={`text-base text-gray-600 font-semibold ${props?.labelStyle}`}
        >
          {props?.label}
        </Text>
      )}
      <MainTextInput
        {...result}
        onChangeText={(text: string) => {
          props?.onChangeText && props?.onChangeText(text);
          setInputValue(text);
        }}
      />
      <ErrorMessage
        message={result?.errorMessage && result?.errorMessage}
        show={result?.error}
      />
    </>
  );
};

export const PhoneNumberInput = (
  props: TextInputPropsType & { iconSize?: number },
) => {
  const [inputValue, setInputValue] = useState(props?.value);
  const { t } = useTranslation();

  const result: TextInputPropsType = TextInputProps({
    ...props,
    placeholder: t("Votre téléphone").toString(),

    keyboardType: "phone-pad",
    left: () => (
      <MaterialIcons
        name="phone"
        size={props?.iconSize ?? 20}
        color={Colors.grey}
      />
    ),
    style: {
      marginBottom: 20,
      ...(StyleSheet.flatten(props.style) || {}),
    },
    value: inputValue,
  });

  return (
    <>
      <MainTextInput
        {...result}
        onChangeText={(text: string) => {
          const rawValue = text.replace(/\D/g, "");
          const formattedValue = rawValue.replace(
            /(\d{2})(\d{2})?(\d{2})?(\d{2})?/,
            (_, p1, p2, p3, p4) => [p1, p2, p3, p4].filter(Boolean).join(" "),
          );
          props?.onChangeText && props?.onChangeText(rawValue);
          setInputValue(formattedValue);
        }}
        maxLength={12}
      />

      <ErrorMessage
        message={result?.errorMessage && result?.errorMessage}
        show={result?.error}
      />
    </>
  );
};

export const PasswordInput = (
  props: TextInputPropsType & { iconSize?: number },
) => {
  const [inputValue, setInputValue] = useState(props?.value);
  const [visible, setVisible] = useState(false);

  const { t } = useTranslation();

  const result: TextInputPropsType = TextInputProps({
    ...props,
    placeholder: t(props?.placeholder ?? "Code PIN").toString(),
    right: () => (
      <TouchableOpacity
        onPress={() => {
          setVisible(!visible);
        }}
      >
        {visible ? (
          <MaterialIcons
            name="visibility-off"
            size={scale(props?.iconSize ?? 20)}
            color={Colors.grey}
          />
        ) : (
          <MaterialIcons
            name="visibility"
            size={scale(props?.iconSize ?? 20)}
            color={Colors.grey}
          />
        )}
      </TouchableOpacity>
    ),
    style: {
      marginBottom: 20,
      ...(StyleSheet.flatten(props.style) || {}),
    },
    value: inputValue,
    secureTextEntry: !visible,
  });

  delete result.label;

  return (
    <>
      {props?.label && (
        <Text
          className={`text-base text-gray-600 font-semibold ${props?.labelStyle}`}
        >
          {props?.label}
        </Text>
      )}
      <MainTextInput
        {...result}
        onChangeText={(text: string) => {
          // const newValue = text.replace(/\D/g, "");
          setInputValue(text);
          props?.onChangeText && props?.onChangeText(text);
        }}
      />

      <ErrorMessage
        message={result?.errorMessage && result?.errorMessage}
        show={result?.error}
      />
    </>
  );
};
export const DatePicker = ({
  label,
  value,
  onChange,
  placeholder,
  containerStyle,
  labelStyle,
  error,
  errorMessage,
  validDateRange,
}: {
  label?: string;
  value: Date;
  onChange: (value: Date) => void;
  placeholder?: string;
  containerStyle?: string;
  labelStyle?: string;
  error?: boolean;
  errorMessage?: string;
  validDateRange?: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
}) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<string>();

  useEffect(() => {
    if (value) {
      setDate(dayjs(value).format("DD/MM/YYYY"));
    }
  }, [value]);

  return (
    <>
      {label && (
        <Text
          className={`text-base text-gray-600 font-semibold mb-1 ${labelStyle}`}
        >
          {label}
        </Text>
      )}
      <TouchableOpacity
        className={`w-full items-center border mt-2.5 rounded-lg h-12 px-2.5 flex flex-row justify-between ${errorMessage ? "mb-2" : "mb-1"} ${containerStyle}`}
        onPress={() => {
          setOpen(true);
        }}
        style={{
          borderColor: Colors.grey,
          backgroundColor: Colors.extremLightGrey,
        }}
      >
        <Text
          className="text-xl"
          style={{
            color: Colors.grey,
          }}
        >
          {date ?? placeholder ?? ""}
        </Text>
        <MaterialIcons
          name="calendar-today"
          size={scale(20)}
          color={Colors.grey}
        />
      </TouchableOpacity>
      <ErrorMessage message={errorMessage && errorMessage} show={error} />
      <DatePickerModal
        locale="en"
        mode="single"
        visible={open}
        onDismiss={() => setOpen(false)}
        date={value}
        onConfirm={({ date: selectedDate }) => {
          setOpen(false);
          if (!selectedDate) return;
          onChange(selectedDate);
          setDate(dayjs(selectedDate).format("DD/MM/YYYY"));
        }}
        validRange={validDateRange}
      />
    </>
  );
};

export const ErrorMessage = ({
  message,
  show,
}: {
  message?: string;
  show?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <HelperText
      type="error"
      visible={show}
      style={{
        marginTop: -8,
        marginBottom: 0,
        width: "100%",
        fontSize: scale(13),
        color: Colors.darkBlack,
      }}
    >
      {message && `* ${t(message).toString()}`}
    </HelperText>
  );
};
