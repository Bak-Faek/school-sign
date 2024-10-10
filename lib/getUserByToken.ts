import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserByToken(userId: number) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user by token:", error);
    throw new Error("Error fetching user");
  }
}
