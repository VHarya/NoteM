import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma-client";
import { formatTagsToArray } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { name }: { name: string } = await request.json();

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Your session has expired." },
      { status: 401, url: "/login" },
    );
  }

  try {
    await prisma.tag.create({
      data: { name: formatTagsToArray(name)[0], userId: user.id },
    });

    return NextResponse.json(
      { message: "Successfully created." },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An unexpected error occured." },
      { status: 500 },
    );
  }
}
