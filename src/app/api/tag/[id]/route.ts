import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/tag/[id]">,
) {
  const { id } = await ctx.params;
  const { name }: { name: string } = await request.json();

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized action." },
      { status: 401 },
    );
  }

  try {
    const formattedName = name
      .trim()
      .split("#")
      .map((t) =>
        t
          .replace(/[^a-zA-Z0-9_ ]/g, "")
          .trim()
          .replace(/\s+/g, "_")
          .toLowerCase(),
      )
      .filter((val) => val)
      .join("_");

    const result = await prisma.tag.updateMany({
      where: { id: id, userId: user.id },
      data: { name: formattedName },
    });

    if (result.count <= 0) {
      return NextResponse.json(
        { message: "Failed to update data." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Successfully changed data." },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "An unknown error occurred." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<"/api/tag/[id]">,
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
    const res = await prisma.tag.deleteMany({
      where: { id: id, userId: user.id },
    });

    if (res.count <= 0) {
      return NextResponse.json(
        { message: "Failed to delete data." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Successfully deleted." },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Unknown error occured." },
      { status: 500 },
    );
  }
}
