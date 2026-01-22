import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma-client";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return NextResponse.json(
      { message: "Session not found." },
      { status: 500 }
    );
  }

  await prisma.session.deleteMany({
    where: { token: sessionToken },
  });

  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set("session_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return response;
}
