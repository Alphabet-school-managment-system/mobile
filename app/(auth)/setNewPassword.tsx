import Button from "@/components/ui/button";
import { Index as Logo } from "@/components/ui/logo";
import { Text } from "@/components/ui/text";
import { PasswordInput } from "@/components/ui/textinput";
import { Colors } from "@/constants/colors";
import { authClient } from "@/lib/auth-client";
import { SetNewPasswordForm, setNewPasswordSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Index() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SetNewPasswordForm>({
    resolver: zodResolver(setNewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const { email, otp } = useLocalSearchParams();

  const [datas, setDatas] = useState({
    email: "",
    otp: "",
  });

  useEffect(() => {
    if (!email || !otp) return;

    const emailValue = Array.isArray(email) ? email[0] : email;
    const otpValue = Array.isArray(otp) ? otp[0] : otp;

    if (emailValue.length > 0 && otpValue.length > 0) {
      setDatas({
        email: emailValue,
        otp: otpValue,
      });
    }
  }, [email, otp]);

  const handleSetNewPassword = async (values: any) => {
    try {
      setLoading(true);
      await authClient.emailOtp.resetPassword(
        {
          otp: datas.otp,
          email: datas.email,
          password: values.password,
        },
        {
          onSuccess() {
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Password reset successful! Please log in.",
            });
            setTimeout(() => {
              setLoading(false);
              router.push("/(auth)/login");
            }, 100);
          },
          onError(context: any) {
            setLoading(false);
            Toast.show({
              type: "error",
              text1: "Error",
              text2: context.error.message,
            });
          },
        },
      );
    } catch (error: any) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.message || "Something went wrong!",
      });
    }
  };

  return (
    <View className="flex-1 px-5 justify-center bg-white mx-0">
      <Logo />

      <View>
        <Text
          className="font-extrabold"
          variant="titleLarge"
          style={{ color: Colors.purple }}
        >
          Set New Password
        </Text>

        <Text
          className="text-gray-600 mt-2 mb-8 leading-8"
          variant="titleMedium"
        >
          Your new password must be different from previous used passwords.
        </Text>
      </View>
      <View className="space-y-4">
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <PasswordInput
              placeholder="Enter new password"
              secureTextEntry={true}
              value={field.value}
              onChangeText={field.onChange}
              error={!!errors.password}
              errorMessage={errors?.password?.message}
              style={{ marginBottom: 0 }}
              label="New Password"
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <PasswordInput
              placeholder="Confirm new password"
              secureTextEntry={true}
              value={field.value}
              onChangeText={field.onChange}
              error={!!errors.confirmPassword}
              errorMessage={errors?.confirmPassword?.message}
              style={{ marginBottom: 0 }}
              label="Confirm New Password"
            />
          )}
        />
      </View>
      <Button
        className="mt-4"
        title="Change"
        onPress={handleSubmit(
          async (values) => {
            handleSetNewPassword(values);
          },
          (errors) => {
            console.log(errors);
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
          <Text className="!text-blue-500 text-base" variant="titleLarge">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
