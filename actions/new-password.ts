"use server";

import * as z from "zod";
import { PasswordSchema } from "@/schemas";
import { getPasswordRestTokenByToken } from "@/api/password-reset-token";
import { getUserByEmail } from "@/api/user";
import { db } from "@/lib/db";
import bcrypt from 'bcryptjs';

export const newPassword = async (
  values: z.infer<typeof PasswordSchema>,
  token: string | null
) => {
  if (!token) return { error: "Missing token!" };

  const validateFields = PasswordSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validateFields.data;

  const existToken = await getPasswordRestTokenByToken(token);
  if (!existToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existUser = await getUserByEmail(existToken.email);
    if(!existUser) {
        return {error: "User/Email does not exist!"}
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
        where: {id: existUser.id},
        data: {
            password: hashedPassword
        }
    });

    await db.passwordResetToken.delete({
        where: {id: existToken.id}
    });

    return {success: "Password changed!"}
};
