import Button from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { PasswordInput } from "@/components/ui/textinput";
import { changePassword } from "@/lib/auth-client";
import { ChangePasswordForm, changePasswordSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

export const Index = ({
  onClose,
}: {
  onClose: ({
    showLoading,
    hasError,
  }: {
    showLoading: boolean;
    hasError: boolean;
  }) => void;
}) => {
  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleChangePassword = async (values: ChangePasswordForm) => {
    await changePassword(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true,
      },
      {
        onRequest: () => onClose({ showLoading: true, hasError: false }),
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Password changed successfully.",
          });
          onClose({ showLoading: false, hasError: false });
        },
        onError: (ctx) => {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: ctx.error.message || "Failed to change password.",
          });
          onClose({ showLoading: false, hasError: true });
        },
      },
    );
  };

  return (
    <View className="flex-1 px-2 justify-center bg-white mx-4">
      <View>
        <Text
          className="font-extrabold"
          variant="titleLarge"
          style={{ color: colors.primary }}
        >
          Change Password
        </Text>
        <Text className="text-gray-600 mt-2 mb-8" variant="titleMedium">
          Enter your current password and set a new one.
        </Text>
      </View>

      <View className="space-y-4">
        <Controller
          control={control}
          name="currentPassword"
          render={({ field }) => (
            <PasswordInput
              placeholder="Enter current password"
              secureTextEntry={true}
              value={field.value}
              onChangeText={field.onChange}
              error={!!errors.currentPassword}
              errorMessage={errors?.currentPassword?.message}
              style={{ marginBottom: 0 }}
              label="Current Password"
            />
          )}
        />
        <Controller
          control={control}
          name="newPassword"
          render={({ field }) => (
            <PasswordInput
              placeholder="Enter new password"
              secureTextEntry={true}
              value={field.value}
              onChangeText={field.onChange}
              error={!!errors.newPassword}
              errorMessage={errors?.newPassword?.message}
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
        title="Change Password"
        onPress={handleSubmit(
          async (values) => {
            handleChangePassword(values);
          },
          () => {},
        )}
      />

      <View className="flex-row justify-center items-center mr-2">
        <TouchableOpacity
          onPress={() => {
            onClose({ showLoading: false, hasError: false });
          }}
        >
          <Text className="!text-blue-500 text-base" variant="titleLarge">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
