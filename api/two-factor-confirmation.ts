import { db } from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: { userId },
    });

    return twoFactorConfirmation;
  } catch (error) {
    return null;
  }
};

export const deleteTwoFactorConfirmationById = async (id: string) => {
  await db.twoFactorConfirmation.delete({ where: { id } });
};

// Create emtpy confirmation for next 2FA verify
export const createTwoFactorConfirmationByUserId = async (userId: string) => {
  await db.twoFactorConfirmation.create({ data: { userId } });
};
