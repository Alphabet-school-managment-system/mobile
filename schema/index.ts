import {
  AttendanceStatusEnum,
  LearningMaterialFileTypeEnum,
  LearningMaterialSourceEnum,
  LearningMaterialStatusEnum,
} from "@/models/enums";
import { z } from "zod";

const MAX_LEARNING_MATERIAL_FILE_SIZE_BYTES = 200 * 1024 * 1024;
const learningMaterialBaseFields = {
  id: z.string().uuid().optional(),
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(255, "Title must be 255 characters or less"),
  description: z.string().nullable().optional(),
  material_url: z.string().trim().optional(),
  material_file: z.any().optional(),
  material_type: z.nativeEnum(LearningMaterialFileTypeEnum),
  material_size: z.coerce
    .number()
    .int()
    .nonnegative()
    .max(
      MAX_LEARNING_MATERIAL_FILE_SIZE_BYTES,
      "Material size must be 200 MB or less.",
    )
    .readonly(),
  uploaded_by: z.string().uuid(),
  branch_id: z.string().uuid(),
  school_id: z.string().uuid().optional(),
  grade: z.string().max(50).optional(),
  subject: z.string().max(100).optional(),
  material_source: z
    .nativeEnum(LearningMaterialSourceEnum)
    .optional()
    .default(LearningMaterialSourceEnum.LINK),
  status: z.nativeEnum(LearningMaterialStatusEnum).optional(),
};
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

export const assessmentFormSchema = z.object({
  academic_year_id: z.string().uuid(),
  title: z.string().trim().min(1, "required").max(50, "Max 50 characters"),
  subject: z.string().trim(),
  grade: z.string({ message: "require" }).max(100).trim(),
  section: z.string().max(100).trim().optional(),
  max_score: z.coerce
    .number({ message: "required" })
    .int("Max score must be a whole number")
    .min(1, "Max score must be at least 1")
    .max(100, "Max score cannot exceed 100"),
  note: z.string().max(250).nullable().optional(),
  teacher_id: z.string().uuid().nullable().optional(),
});

export type AssessmentForm = z.input<typeof assessmentFormSchema>;

export const markFormSchema = z.object({
  assessment_id: z.string().uuid("Invalid assessment id"),
  student_id: z.string().uuid("Invalid student id"),
  score: z.coerce
    .number({ message: "required" })
    .min(0, "Score must be at least 0")
    .max(100, "Score cannot exceed 100"),
});

export type MarkForm = z.input<typeof markFormSchema>;

export const attendanceSchema = z.object({
  id: z.string().uuid(),
  academic_year_id: z.string().uuid(),
  term: z.string().max(100).optional(),
  student_id: z.string().uuid(),
  date: z.coerce.date(),
  created_at: z.coerce.date().nullable().optional(),
  updated_at: z.coerce.date().nullable().optional(),
  status: z.nativeEnum(AttendanceStatusEnum),
});

export type AttendanceForm = z.input<typeof attendanceSchema>;

export const learningMaterialSchema = z
  .object(learningMaterialBaseFields)
  .superRefine((data, ctx) => {
    const materialUrl = data.material_url?.trim();

    if (data.material_source === LearningMaterialSourceEnum.LINK) {
      if (!materialUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["material_url"],
          message: "Material URL is required for linked materials.",
        });
      } else if (!z.string().url().safeParse(materialUrl).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["material_url"],
          message: "Enter a valid URL for linked materials.",
        });
      }
    }

    if (data.material_source === LearningMaterialSourceEnum.FILE) {
      if (!data.material_file) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["material_file"],
          message: "Select a PDF or MP4 file.",
        });
      }

      if (data.material_size <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["material_size"],
          message: "Material size is required for uploaded files.",
        });
      } else if (data.material_size > MAX_LEARNING_MATERIAL_FILE_SIZE_BYTES) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["material_size"],
          message: "Material size must be 200 MB or less.",
        });
      }
    }
  });

export type LearningMaterialForm = z.input<typeof learningMaterialSchema>;

export const learningMaterialUpdateSchema = z
  .object({
    ...learningMaterialBaseFields,
    material_size: z.coerce
      .number()
      .int()
      .nonnegative()
      .max(
        MAX_LEARNING_MATERIAL_FILE_SIZE_BYTES,
        "Material size must be 200 MB or less.",
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    const materialUrl = data.material_url?.trim();

    if (data.material_source === LearningMaterialSourceEnum.LINK) {
      if (!materialUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["material_url"],
          message: "Material URL is required for linked materials.",
        });
      } else if (!z.string().url().safeParse(materialUrl).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["material_url"],
          message: "Enter a valid URL for linked materials.",
        });
      }
    }

    if (data.material_source === LearningMaterialSourceEnum.FILE) {
      if (!data.material_file && !materialUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["material_url"],
          message:
            "Keep the existing file URL or select a new PDF/MP4 file.",
        });
      }

      if (
        data.material_file &&
        (typeof data.material_size !== "number" || data.material_size <= 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["material_size"],
          message: "Material size is required for uploaded files.",
        });
      } else if (
        typeof data.material_size === "number" &&
        data.material_size > MAX_LEARNING_MATERIAL_FILE_SIZE_BYTES
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["material_size"],
          message: "Material size must be 200 MB or less.",
        });
      }
    }
  });

export type LearningMaterialUpdateForm = z.input<
  typeof learningMaterialUpdateSchema
>;
