"use server";

import * as z from "zod";
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/api/user";
import { generatePasswordResetToken } from "@/lib/token";
import { sendPasswordResetEmail } from "@/lib/mail";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validateFields = ResetSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validateFields.data;

  const existUser = await getUserByEmail(email);
  if (!existUser || !existUser.email || !existUser.password) {
    return { error: "User email does not exist!" };
  }

  const passwordResetToken = await generatePasswordResetToken(existUser.email);
  await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

  return { success: "Reset email sent!" };
};
