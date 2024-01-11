"use server";

import { getUserByEmail } from "@/api/user";
import { getVerificationTokenByToken } from "@/api/verification-token";
import { db } from "@/lib/db";


export const newVerification = async(token: string) => {
    const existToken = await getVerificationTokenByToken(token);
    if(!existToken) {
        return {error: "Token does not exist!"}
    }

    const hasExpired = new Date(existToken.expires) < new Date();
    if(hasExpired) {
        return {error: "Token has expired!"}
    }

    const existUser = await getUserByEmail(existToken.email);
    if(!existUser) {
        return {error: "User/Email does not exist!"}
    }

    await db.user.update({
        where: {id: existUser.id},
        data: {
            emailVerified: new Date(),
            email: existToken.email,
        }
    });

    await db.verificationToken.delete({
        where: {id: existToken.id}
    });

    return {success: "Email verified!"}
}