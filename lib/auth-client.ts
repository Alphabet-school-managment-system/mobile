import { expoClient } from "@better-auth/expo/client";
import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";
import { fetch } from "expo/fetch";

const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_ENDPOINT ||
  "https://wild-joan-bring-days.trycloudflare.com"
).replace(/\/+$/, "");

export const authClient = createAuthClient({
  baseURL: `${API_BASE_URL}/api/auth`,
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
