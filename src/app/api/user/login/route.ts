import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma-client";
import crypto from "crypto";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  const { email, password, remember } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      {
        message: "All fields are required.",
        fieldErrors: {
          email: "Email cannot be empty.",
          password: "Password cannot be empty.",
        },
      },
      { status: 400 },
    );
  }

  console.log("remember: ", remember);

  try {
    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { message: "User isn't found!" },
        { status: 500 },
      );
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      return NextResponse.json(
        { message: "Incorrect Password!" },
        { status: 400 },
      );
    }

    const response = NextResponse.json(
      { message: "Successfully Signed-in!" },
      { status: 200 },
    );

    const sessionToken = crypto.randomBytes(32).toString("hex");
    let sessionExpire = 24 * 60 * 60;

    if (remember) {
      sessionExpire = 7 * 24 * 60 * 60;
    }

    console.log("sessionExpire: ", sessionExpire);

    await prisma.$transaction(async (tx) => {
      const session = await tx.session.create({
        data: {
          userId: user.id,
          token: sessionToken,
          expiresAt: new Date(Date.now() + sessionExpire * 1000),
        },
      });

      response.cookies.set("session_token", session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: sessionExpire,
      });
    });

    return response;
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "An unexpected error occured!" },
      { status: 500 },
    );
  }
}
