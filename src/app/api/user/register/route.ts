import prisma from "@/lib/prisma-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      {
        message: "All fields are required.",
        fieldErrors: {
          email: "Email cannot be empty.",
          password: "Password cannot be empty.",
        },
      },
      { status: 400 }
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    const response = NextResponse.json(
      { message: "Successfully Signed-in!" },
      { status: 200 }
    );

    const sessionToken = crypto.randomBytes(32).toString("hex");

    await prisma.$transaction(async (tx) => {
      const session = await tx.session.create({
        data: {
          userId: user.id,
          token: sessionToken,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      response.cookies.set("session_token", session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60,
      });
    });

    return response;
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "An unexpected error occured!" },
      { status: 500 }
    );
  }
}
