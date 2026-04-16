import Button from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { PasswordInput, TextInput } from "@/components/ui/textinput";
import { signIn } from "@/lib/auth-client";
import { LoginForm, loginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { Checkbox, useTheme } from "react-native-paper";

import { Index as Logo } from "@/components/ui/logo";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { useApiQuery } from "@/hooks/useApi";
import { IdsContext } from "@/store/idsContext";
import {
  defaultModalProps,
  ModalContext,
  ModalPropsType,
} from "@/store/modalContext";
import { UserContext, UserDataType } from "@/store/userContext";
import Toast from "react-native-toast-message";

export default function Index() {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userData, setUserData } = useContext(UserContext);
  const [getIds, setGetIds] = useState(false);
  const { setIds } = useContext(IdsContext);
  const { setModalProps } = useContext(ModalContext);

  const { colors } = useTheme();
  const apiEndpoint = {
    getIds: `${userData?.role}/getIds/${userData?.better_auth_userId}`,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "surafelhabte92@gmail.com",
      password: "Abcd@5304",
      rememberMe: checked,
    },
  });

  const {
    data: ids,
    isLoading: isGettingIds,
    refetch,
  } = useApiQuery<any>([apiEndpoint.getIds], apiEndpoint.getIds, false);

  useEffect(() => {
    if (getIds === true && userData?.better_auth_userId) {
      refetch();
    }
  }, [getIds]);

  useEffect(() => {
    if (ids) {
      setIds({
        branchId: ids?.branch?.id,
        branchName: ids?.branch?.name,
        schoolId: ids?.branch?.school_id,
        academicYearId: ids?.academic_year?.id,
      });
      setUserData((prev: UserDataType) => ({
        ...prev,
        id: ids?.user?.id,
        token: ids?.token,
        subject_specialization: ids?.user?.subject_specialization,
      }));
      setTimeout(() => {
        setLoading(false);
        setModalProps((prev: ModalPropsType) => ({
          ...defaultModalProps,
          show: false,
        }));
        router.push("/(app)/(teacher)/dashboard");
      }, 100);
    }
  }, [ids, setIds, setModalProps, setUserData]);

  const handlelogin = async (values: any) => {
    await signIn.email(
      {
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onError: (ctx) => {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: ctx.error.message,
          });
          setLoading(false);
        },
        onSuccess: (context: any) => {
          setUserData((prev: UserDataType) => ({
            ...prev,
            first_name: context?.data?.user?.name,
            image: context?.data?.user?.image,
            email: context?.data?.user?.email,
            better_auth_userId: context?.data?.user?.id,
            better_auth_token: context?.data?.token,
          }));
          setGetIds(true);
        },
      },
    );
  };

  useEffect(() => {
    setModalProps((prev: ModalPropsType) => ({
      ...defaultModalProps,
      show: loading || isGettingIds,
    }));
  }, [loading, isGettingIds]);

  useEffect(() => {
    return () => {
      setModalProps((prev: ModalPropsType) => ({
        ...defaultModalProps,
        show: false,
      }));
    };
  }, [setModalProps]);

  return (
    <View className="flex-1 px-5 justify-center rounded-3xl bg-white mx-4">
      <Logo />
      <View>
        <Text
          className="font-extrabold"
          variant="displaySmall"
          style={{ color: colors.primary }}
        >
          Log In
        </Text>
        <Text
          className="mt-2"
          variant="titleLarge"
          style={{ color: colors.primary }}
        >
          Welcome to Alphabet SMS
        </Text>
        <Text className="text-gray-600 mt-2 mb-8" variant="titleMedium">
          Please enter your credentials to continue.
        </Text>
      </View>

      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextInput
            keyboardType="email-address"
            placeholder="e.g.john.doe@example.com"
            left={undefined}
            value={field.value}
            onChangeText={field.onChange}
            error={!!errors.email}
            errorMessage={errors?.email?.message}
            label="Email address"
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <PasswordInput
            placeholder="Enter your password"
            secureTextEntry={true}
            value={field.value}
            onChangeText={field.onChange}
            error={!!errors.password}
            errorMessage={errors?.password?.message}
            style={{ marginBottom: 0 }}
            label="Password"
          />
        )}
      />
      <Controller
        control={control}
        name="rememberMe"
        render={({ field }) => (
          <View className="flex-row justify-between items-start">
            <Checkbox.Item
              label="Remember Me"
              labelStyle={{ fontSize: 16 }}
              position="leading"
              labelVariant="labelLarge"
              status={checked === true ? "checked" : "unchecked"}
              onPress={() => {
                setChecked(!checked);
                field.onChange(!field.value);
              }}
            />
          </View>
        )}
      />

      <Button
        className="mt-4"
        title="Login"
        onPress={handleSubmit(
          async (values) => {
            handlelogin(values);
          },
          (errors) => {
            console.log(errors);
          },
        )}
      />
      <View className="flex-row justify-center items-center mr-2">
        <TouchableOpacity
          onPress={() => {
            router.push("/forgetPassword");
          }}
        >
          <Text className="text-blue-500 text-base">Forgot Password ?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
