import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().nonempty("required").email("Invalid email address"),

  password: z.string().nonempty("required"),
  rememberMe: z.boolean().optional(),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const forgetPasswordSchema = z.object({
  email: z.string().nonempty("required").email("Invalid email address"),
});

export type forgetPasswordForm = z.infer<typeof forgetPasswordSchema>;

export const setNewPasswordSchema = z.object({
  password: z.string().nonempty("required"),
  confirmPassword: z.string().nonempty("required"),
});

export type SetNewPasswordForm = z.infer<typeof setNewPasswordSchema>;
