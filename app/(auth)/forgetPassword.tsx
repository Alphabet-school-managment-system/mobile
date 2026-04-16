import Button from "@/components/ui/button";
import { Index as Logo } from "@/components/ui/logo";
import { Text } from "@/components/ui/text";
import { TextInput } from "@/components/ui/textinput";
import { forgetPassword } from "@/lib/auth-client";
import { forgetPasswordForm, forgetPasswordSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {  View } from "react-native";
import { useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";


export default function Index() {
  const [loading, setLoading] = useState(false);

  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<forgetPasswordForm>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const HandleForgetPassword = async (values: any) => {
    try {
      setLoading(true);
      await forgetPassword.emailOtp(
        {
          email: values?.email,
        },
        {
          onSuccess(ctx: any) {
            Toast.show({
              type: "success",
              text1: "Success",
              text2: `Password reset OTP sent to ${values.email}`,
            });

            setTimeout(() => {
              setLoading(false);
              router.push(`/otp?email=${encodeURIComponent(values.email)}`);
            }, 200);
          },
          onError(context: any) {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: context.error.message,
            });
            setLoading(false);
          },
        },
      );
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.message || "Something went wrong!",
      });
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 px-5 justify-center rounded-3xl bg-white mx-4">
      <View className="items-center mb-4">
        <Logo />
      </View>

      <View>
        <Text
          className="font-extrabold"
          variant="titleLarge"
          style={{ color: colors.primary }}
        >
          Forgot Password
        </Text>

        <Text className="text-gray-600 mt-2 mb-8" variant="titleMedium">
          Enter your email address to recover your password.
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

      <Button
        className="mt-4"
        title="Send OTP"
        onPress={handleSubmit(
          async (values) => {
            HandleForgetPassword(values);
          },
          (errors) => {
            Toast.show({
              type: "error",
              text1: "Error",
              text2:
                errors.email?.message || "Please fix the errors in the form.",
            });
          },
        )}
        loading={loading}
      />
      <View className="flex-row justify-center items-center mr-2">
        <TouchableOpacity
          onPress={() => {
            router.push("/login");
          }}
          disabled={loading}
        >
          <Text className="text-blue-500 text-base">Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
