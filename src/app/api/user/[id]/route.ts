import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma-client";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/user/[id]">,
) {
  const { id } = await ctx.params;
  const { name, email } = await request.json();

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Your session has expired." },
      { status: 401 },
    );
  }

  try {
    await prisma.user.update({
      data: { name, email },
      where: { id: id },
    });

    revalidatePath("/(main)/", "layout");

    return NextResponse.json(
      { message: "Successfully updated." },
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
