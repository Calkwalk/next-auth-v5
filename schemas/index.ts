import * as z from "zod";
import { UserRole } from "@prisma/client";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.optional(z.enum([UserRole.ADMIN, UserRole.USER])),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  );

export const PasswordSchema = z.object({
  password: z.string().min(3).max(64),
});

export const ResetSchema = z.object({
  email: z.string().email({ message: "Email is required." }),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required." }),
  password: z.string().min(3).max(64),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  name: z.string().min(1).max(128),
  email: z.string().email({ message: "Email is required." }),
  password: z.string().min(3).max(64),
});
