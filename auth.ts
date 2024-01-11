import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { getUserById } from "@/api/user";
import { getTwoFactorConfirmationByUserId } from "@/api/two-factor-confirmation";
import { UserRole } from "@prisma/client";
import { getAccountByUserId } from "./api/account";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if(account?.provider !== "credentials") return true;

      const existUser = await getUserById(user.id);

      // Prevent sign in without email verification
      if(!existUser || !existUser.emailVerified) return false;

      // 2FA (two factor verify)
      if(existUser.isTwoFactorEnabled){
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existUser.id)
        // console.log({twoFactorConfirmation: twoFactorConfirmation})
        if(!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({where:{id: twoFactorConfirmation.id}});
      }

      return true;
    },
    async session({ session, token }) {

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if(session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;

        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existUser = await getUserById(token.sub);
      if (!existUser) return token;

      const existAccount = await getAccountByUserId(existUser.id);

      token.isOAuth = !!existAccount;
      token.name = existUser.name;
      token.email = existUser.email;
      token.role = existUser.role;
      token.isTwoFactorEnabled = existUser.isTwoFactorEnabled;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
