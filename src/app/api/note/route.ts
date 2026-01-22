import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized user!" },
      { status: 401 }
    );
  }

  const tagString = body.tags as String;
  const tags = tagString
    .trim()
    .split("#")
    .map((t) =>
      t
        .replace(/[^a-zA-Z0-9_ ]/g, "")
        .trim()
        .replace(/\s+/g, "_")
        .toLowerCase()
    )
    .filter((val) => val);

  try {
    await prisma.$transaction(async (tx) => {
      let tagList = [];

      for (const tag of tags) {
        const res = await tx.tag.upsert({
          create: { name: tag, userId: user.id },
          update: { name: tag },
          where: { name_userId: { name: tag, userId: user.id } },
        });

        tagList.push(res);
      }

      await tx.note.create({
        data: {
          title: body.title,
          content: body.content,
          userId: user.id,
          categories: { connect: tagList.map((val) => ({ id: val.id })) },
        },
      });
    });

    return NextResponse.json(
      { message: "Successfully created a new note!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { message: "Unexpected error occured!" },
      { status: 500 }
    );
  }
}
