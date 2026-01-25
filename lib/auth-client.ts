import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";
import { fetch } from "expo/fetch";

export const authClient = createAuthClient({
  baseURL: "http://10.228.57.112:4000/api/auth",
  fetch,
  plugins: [
    expoClient({
      scheme: "alphabet",
      storagePrefix: "alphabet",
      storage: SecureStore,
    }),
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
} = authClient;
