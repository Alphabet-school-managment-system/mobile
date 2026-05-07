import Button from "@/components/ui/button";
import { Index as Logo } from "@/components/ui/logo";
import { Text } from "@/components/ui/text";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { emailOtp } from "@/lib/auth/auth-client";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

const formatTime = (s: number) => {
  const result = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  return result;
};

export default function OtpScreen() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState<string>("");
  const [seconds, setSeconds] = useState(600);
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const otpInputRef = useRef<any>(null);
  const [attempt, setAttempt] = useState(5);
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const { email: emailFromParams } = useLocalSearchParams();

  useEffect(() => {
    if (seconds === 0) {
      setIsTimeExpired(true);
      return;
    }
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  useEffect(() => {
    if (!emailFromParams) return;

    const emailValue = Array.isArray(emailFromParams)
      ? emailFromParams[0]
      : emailFromParams;

    if (emailValue.length > 0) {
      setEmail(emailValue);
    }
  }, [emailFromParams]);

  const HandleVerifyOtp = async () => {
    try {
      setLoading(true);
      setAttempt((prev) => prev - 1);

      await emailOtp.checkVerificationOtp(
        {
          email: email,
          otp: code,
          type: "forget-password",
        },
        {
          onSuccess(ctx) {
            Toast.show({
              type: "success",
              text1: "Success",
              text2: `Otp verified successfully. You can now reset your password!`,
            });

            setTimeout(() => {
              setLoading(false);
              router.push(
                `/(auth)/set-new-password?email=${encodeURIComponent(email)}&otp=${code}`,
              );
            }, 200);
          },
          onError(context: any) {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "Invalid OTP. Please try again.",
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
      <Logo />
      <View className="flex justify-center items-center">
        <Text
          className="mt-2"
          variant="titleLarge"
          style={{ color: colors.primary }}
        >
          Verify Your Email
        </Text>
        <Text
          className="text-gray-600 mt-2 mb-8 text-center"
          variant="titleMedium"
          disableTranslation={true}
        >
          {`Enter the 6-digit code sent to your email address. ${email}`}
        </Text>
      </View>
      <OtpInput
        numberOfDigits={6}
        onTextChange={(code: string) => setCode(code)}
        autoFocus={false}
        theme={{
          containerStyle: {
            marginBottom: 24,
          },
        }}
        ref={otpInputRef}
      />
      <View className="flex flex-row items-center justify-center mb-6">
        <Text className="mr-2">Didn't receive the code?</Text>
        <TouchableOpacity
          disabled={!isTimeExpired}
          onPress={() => {
            setSeconds(120);
            setIsTimeExpired(false);
            setCode("");
            otpInputRef.current?.clear();
            otpInputRef.current?.setValue("");
          }}
        >
          <Text className="text-blue-600 font-semibold">Resend it.</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text
          className={`text-center mb-2 ${isTimeExpired ? "text-red-400" : ""}`}
          variant="titleMedium"
          disableTranslation={true}
        >
          {` ${isTimeExpired ? "Time expired" : formatTime(seconds)} `}
        </Text>
        <Text className={`text-center mb-4 }`}>
          {`You have ${attempt} attempts left.`}
        </Text>
      </View>
      <Button
        title="Verify"
        className="!mb-0"
        disabled={code.length < 6 || isTimeExpired || attempt === 0}
        onPress={() => {
          HandleVerifyOtp();
        }}
        loading={loading}
      />
      <View className="flex-row justify-center items-center mt-8">
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          disabled={loading}
        >
          <Text className="text-red-500 text-lg">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
