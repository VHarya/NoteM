import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/note/[id]">,
) {
  const { id } = await ctx.params;

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized action." },
      { status: 401 },
    );
  }

  try {
    const result = await prisma.note.findUnique({
      where: { id: id },
      include: { categories: true },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Can't find note with this id." },
        { status: 404 },
      );
    }

    return NextResponse.json({ note: result }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An unknown error occured." },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/note/[id]">,
) {
  const { id } = await ctx.params;
  const { title, content, tags } = await request.json();

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized action." },
      { status: 401 },
    );
  }

  try {
    const tagString = tags as String;
    const formattedTags = tagString
      .trim()
      .split("#")
      .filter((val) => val)
      .map((t) =>
        t
          .replace(/[^a-zA-Z0-9_ ]/g, "")
          .trim()
          .replace(/\s+/g, "_")
          .toLowerCase(),
      );

    await prisma.$transaction(async (tx) => {
      const currentNote = await tx.note.findUnique({
        where: { id: id },
        include: { categories: true },
      });

      if (!currentNote) {
        throw new Error("note-not-found");
      }

      let tagIds = [];
      for (const tagName of formattedTags) {
        let tag = await tx.tag.findUnique({
          where: { name_userId: { name: tagName, userId: user.id } },
        });

        if (!tag) {
          tag = await tx.tag.create({
            data: { name: tagName, userId: user.id },
          });
        }

        tagIds.push(tag.id);
      }

      await tx.note.update({
        data: {
          title: title,
          content: content,
          userId: user.id,
          categories: {
            set: tagIds.map((val) => ({ id: val })),
          },
        },
        where: { id: id },
      });
    });

    revalidatePath(`/(main)/note/${id}`);
    return NextResponse.json(
      { message: "Successfully updated data." },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error);

    if (error.message === "note-not-found") {
      return NextResponse.json(
        { message: "Couldn't find this note." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "An unexpected error occured." },
      { status: 500 },
    );
  }

  redirect(`/note/${id}`);
}

export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<"/api/note/[id]">,
) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized action." },
      { status: 401 },
    );
  }

  try {
    const result = await prisma.note.deleteMany({
      where: { id: id, userId: user.id },
    });

    if (result.count <= 0) {
      return NextResponse.json(
        { message: "Failed to delete note." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Successfully deleted note!" },
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
