import { expoClient } from "@better-auth/expo/client";
import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";
import { fetch } from "expo/fetch";
import { API_ENDPOINT } from "@/constants/constants";

export const authClient = createAuthClient({
  baseURL: `${API_ENDPOINT}/api/auth`,
  fetch,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    expoClient({
      scheme: "alphabet",
      storagePrefix: "alphabet",
      storage: SecureStore,
    }),
    emailOTPClient(),
  ],
});

export const {
  signIn,
  signUp,
  useSession,
  signOut,
  sendVerificationEmail,
  changePassword,
  changeEmail,
  updateUser,
  requestPasswordReset,
  verifyEmail,
  getSession,
  resetPassword,
  forgetPassword,
  emailOtp,
} = authClient;
