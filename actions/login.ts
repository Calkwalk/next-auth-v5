"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/api/user";
import { generateVerificationToken, generateTwoFactorToken, deleteTwoFactorTokenById } from "@/lib/token";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/api/two-factor-token";
import { createTwoFactorConfirmationByUserId, deleteTwoFactorConfirmationById, getTwoFactorConfirmationByUserId } from "@/api/two-factor-confirmation";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validateFields = LoginSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validateFields.data;

  const existUser = await getUserByEmail(email);

  if (!existUser || !existUser.email || !existUser.password) {
    return { error: "User email does not exist!" };
  } else {
    const passwordMatch = await bcrypt.compare(password, existUser.password);
    if(!passwordMatch) {
      return {error: "Password does not matched!"};
    }
  }

          

  if (!existUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existUser.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent!" };
  }

  if (existUser.isTwoFactorEnabled && existUser.email) {
    if (code) {
      // verify code
      const twoFactorToken = await getTwoFactorTokenByEmail(existUser.email);
      if(!twoFactorToken) {
        return {error: "Invalid code!"}
      }

      if(twoFactorToken.token !== code) {
        return {error: "Invalid code!"}
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if(hasExpired) {
        return {error: "Code expired!"}
      }

      await deleteTwoFactorTokenById(twoFactorToken.id);
      const exitConfirmation = await getTwoFactorConfirmationByUserId(existUser.id)
      if(exitConfirmation) {
        await deleteTwoFactorConfirmationById(exitConfirmation.id);
      }
      await createTwoFactorConfirmationByUserId(existUser.id);
    } else {
      // send code
      const twoFactorToken = await generateTwoFactorToken(existUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          console.log({error: error})
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};
