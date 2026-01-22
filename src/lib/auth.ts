import { cookies } from "next/headers";
import prisma from "./prisma-client";
import { UserSchema } from "./type";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await prisma.session.findFirst({
    where: {
      token: { equals: sessionToken },
      expiresAt: { gte: new Date(Date.now()) },
    },
  });

  if (!session) {
    return null;
  }

  const userResult = await prisma.user.findFirst({
    select: { id: true, name: true, email: true },
    where: { id: session.userId },
  });

  return UserSchema.parse(userResult);
}
