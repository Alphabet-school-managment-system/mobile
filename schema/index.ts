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

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().nonempty("required"),
    newPassword: z.string().nonempty("required"),
    confirmPassword: z.string().nonempty("required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export const leaveRequestFormSchema = z.object({
  academic_year_id: z.string().uuid(),
  student_id: z.string().uuid().nullable().optional(),
  teacher_id: z.string().uuid().nullable().optional(),
  start_date: z.date().nullable().optional(),
  end_date: z.date().nullable().optional(),
  note: z.string().nullable().optional(),
});

export type LeaveRequestForm = z.infer<typeof leaveRequestFormSchema>;
