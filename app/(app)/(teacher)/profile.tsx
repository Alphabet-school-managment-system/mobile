import { Index as ChangePasswordForm } from "@/app/(auth)/change-password";
import Button, { buttonMode } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useApiQuery } from "@/hooks/useApi";
import { signOut } from "@/lib/auth/auth-client";
import { Student, Teacher } from "@/models";
import { BottomSheetContext } from "@/store/providers/BottomSheetContext";
import {
  ConfirmationModalContext,
  ConfirmationModalPropsType,
  defaultConfirmationModalProps,
  defaultModalProps,
  ModalContext,
  ModalPropsType,
} from "@/store/providers/ModalContext";
import {
  defaultUserData,
  UserContext,
} from "@/store/providers/UserContext";

import { router } from "expo-router";
import { useContext } from "react";
import { ScrollView, View } from "react-native";
import { Avatar, List } from "react-native-paper";

import { Index as ConfirmationModal } from "@/components/common/confirmationModal";
import { Index as Loading } from "@/components/common/loading";

export default function Index() {
  const { userData, setUserData, clearPersistedUserData } =
    useContext(UserContext);
  const { setConfirmationModalProps } = useContext(ConfirmationModalContext);
  const { setModalProps } = useContext(ModalContext);
  const { openBottomSheet, closeBottomSheet } = useContext(BottomSheetContext);

  const profileEndpoint = `${[userData?.role]}/${userData?.id}`;

  const { data: profileDetail, isLoading: isProfileLoading } = useApiQuery<
    Teacher & Student
  >([profileEndpoint], profileEndpoint, !!profileEndpoint);

  const handleSignOut = async () => {
    try {
      setModalProps((prev: ModalPropsType) => ({
        ...defaultModalProps,
        show: true,
        showLoadingSpin: true,
        loadingText: "Logging out...",
      }));
      await signOut();
      await clearPersistedUserData();
      clearDatas();
    } catch (e: any) {
      setModalProps((prev: ModalPropsType) => ({
        ...defaultModalProps,
        show: false,
      }));
    }
  };

  const clearDatas = () => {
    setTimeout(async () => {
      setUserData((prev) => ({
        ...defaultUserData,
        skipOnboarding: prev.skipOnboarding ?? true,
        role: undefined,
      }));
      await setModalProps((prev: ModalPropsType) => ({
        ...defaultModalProps,
        show: false,
      }));
      await setConfirmationModalProps((prev: ConfirmationModalPropsType) => ({
        ...defaultConfirmationModalProps,
      }));
      router.replace("/(auth)/who-are-you");
    }, 100);
  };

  const openLogoutConfirmation = () => {
    setConfirmationModalProps((prev: ConfirmationModalPropsType) => ({
      ...prev,
      show: true,
      title: "Confirmation",
      content: "Are you sure you want to log out from this account?",
      okButtonText: "Yes, log out",
      cancelButtonText: "No, stay",
      onOk: handleSignOut,
      onCancel: () => {
        setModalProps((prev: ModalPropsType) => ({
          ...defaultModalProps,
          show: false,
        }));
      },
    }));
    setModalProps((prev: ModalPropsType) => ({
      ...defaultModalProps,
      content: <ConfirmationModal />,
      show: true,
      showLoadingSpin: false,
    }));
  };

  return (
    <View className="flex-1 bg-white p-5">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 180 }}
      >
        {isProfileLoading ? (
          <Loading
            showLoadingSpin={true}
            loadingText={"Loading profile..."}
            className="!mt-12"
          />
        ) : (
          <>
            <View className="items-center mt-4 mb-6">
              <Avatar.Image
                size={86}
                source={
                  profileDetail?.image
                    ? { uri: profileDetail?.image }
                    : require("@/assets/images/default-user-avatar.png")
                }
                className="mr-4"
              />

              <Text
                className="mt-3 font-bold"
                variant="headlineSmall"
                disableTranslation={true}
              >
                {`${profileDetail?.first_name} ${profileDetail?.middle_name} ${userData?.role === "student" ? profileDetail?.last_name : ""}`}
              </Text>
              <Text
                className="text-gray-500"
                variant="bodyLarge"
                disableTranslation={true}
              >
                {profileDetail?.email}
              </Text>
            </View>

            <View className="rounded-xl border border-gray-200 mb-4 overflow-hidden">
              <List.Item
                title="Phone #"
                description={profileDetail?.phone}
                left={(props) => <List.Icon {...props} icon="phone-outline" />}
                descriptionStyle={{
                  fontWeight: "700",
                  fontSize: 18,
                }}
              />
              <List.Item
                title="Sex"
                description={profileDetail?.sex}
                left={(props) => (
                  <List.Icon {...props} icon="gender-male-female" />
                )}
                descriptionStyle={{
                  fontWeight: "700",
                  fontSize: 18,
                }}
              />
              {userData?.role === "teacher" && (
                <List.Item
                  title="Subject Specialization"
                  className="uppercase"
                  description={profileDetail?.subject_specialization}
                  left={(props) => (
                    <List.Icon {...props} icon="book-education-outline" />
                  )}
                  descriptionStyle={{
                    fontWeight: "700",
                    fontSize: 18,
                    textTransform: "uppercase",
                  }}
                />
              )}
              {(userData?.role === "teacher" ||
                userData?.role === "student") && (
                <List.Item
                  title="Registration #"
                  description={
                    userData?.role === "teacher"
                      ? `TEA-${String(profileDetail?.teacher_registration_number).padStart(6, "0")}`
                      : `STU-${String(profileDetail?.student_registration_number).padStart(6, "0")}`
                  }
                  left={(props) => (
                    <List.Icon {...props} icon="card-account-details-outline" />
                  )}
                  descriptionStyle={{
                    fontWeight: "700",
                    fontSize: 18,
                  }}
                />
              )}
              <List.Item
                title="Note"
                description={profileDetail?.note ?? "-- not available --"}
                left={(props) => (
                  <List.Icon {...props} icon="text-box-outline" />
                )}
              />
            </View>
          </>
        )}
      </ScrollView>

      {!isProfileLoading && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 pt-4 pb-6">
          <Button
            title="Change Password"
            onPress={() => {
              openBottomSheet({
                show: true,
                content: (
                  <ChangePasswordForm
                    onClose={({
                      showLoading,
                      hasError,
                    }: {
                      showLoading: boolean;
                      hasError: boolean;
                    }) => {
                      closeBottomSheet();
                      setModalProps((prev: ModalPropsType) => ({
                        ...defaultModalProps,
                        show: showLoading,
                        loadingText: "Changing...",
                      }));

                      if (!showLoading && !hasError) {
                        clearDatas();
                      }
                    }}
                  />
                ),
                onClose: () => {},
                fitToContents: true,
              });
            }}
            mode={buttonMode.CONTAINED}
            style={{
              marginBottom: 10,
            }}
          />
          <Button
            title="Log Out"
            onPress={openLogoutConfirmation}
            mode={buttonMode.OUTLINE}
            tranparent={true}
            textColor="#dc2626"
            style={{ marginBottom: 0, borderColor: "#dc2626", borderWidth: 1 }}
          />
        </View>
      )}
    </View>
  );
}
