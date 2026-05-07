import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  plugins: [expo()],
  trustedOrigins: ["exp://"],
});
