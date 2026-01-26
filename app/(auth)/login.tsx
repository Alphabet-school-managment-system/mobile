import Button from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { PasswordInput, TextInput } from "@/components/ui/textinput";
import { Colors } from "@/constants/colors";
import { signIn } from "@/lib/auth-client";
import { LoginForm, loginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, TouchableOpacity, View } from "react-native";
import { Avatar, Checkbox } from "react-native-paper";

export default function Index() {
  const [checked, setChecked] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: checked,
    },
  });

  const logo = require("@/assets/images/logo.png");

  return (
    <View className="flex-1 px-5 justify-center rounded-3xl bg-white mx-4">
      <View className="items-center mb-4">
        <Avatar.Image
          size={150}
          source={logo}
          style={{
            borderColor: Colors.purple,
            borderWidth: 2,
          }}
        />
      </View>

      <View>
        <Text className="font-extrabold text-purple-900" variant="displaySmall">
          Sign In
        </Text>
        <Text className=" text-purple-800 mt-2" variant="titleLarge">
          Welcome to Alphabet SMS
        </Text>
        <Text className="text-gray-600 mt-2 mb-8" variant="titleMedium">
          Please enter your credentials to continue.
        </Text>
      </View>

      <KeyboardAvoidingView>
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
              const result: any = await signIn.email(
                {
                  email: values.email,
                  password: values.password,
                  rememberMe: values.rememberMe,
                },
                {
                  onRequest: () => {
                    // setLoading(true);
                    console.log(
                      "%capp/(auth)/login.tsx:123 request",
                      "color: #007acc;",
                    );
                  },
                  onError: (ctx) => {
                    console.log(
                      "%capp/(auth)/login.tsx:125 ctx",
                      "color: #007acc;",
                      ctx,
                    );
                    // toast.error(ctx.error.message);
                    // setLoading(false);
                  },
                  onSuccess: (context: any) => {
                    console.log(
                      "%capp/(auth)/login.tsx:129 context",
                      "color: #007acc;",
                      context,
                    );
                    // setUserData({
                    //   first_name: context?.user?.name,
                    //   image: context?.user?.image,
                    //   better_auth_userId: context?.user?.id,
                    // });
                    // setTimeout(() => {
                    //   setLoading(false);
                    //   router.push("/ws/dashboard");
                    // }, 100);
                  },
                },
              );
            },
            (errors) => {
              console.log(errors);
            },
          )}
        />
      </KeyboardAvoidingView>
      <View className="flex-row justify-center items-center mr-2">
        <TouchableOpacity onPress={() => {}}>
          <Text className="text-blue-500 text-base">Forgot Password ?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
