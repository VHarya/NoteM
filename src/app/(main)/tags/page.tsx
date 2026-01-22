"use server";

import CardTag from "@/components/card-tag";
import FilterSort from "@/components/filter-sort";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma-client";
import { redirect } from "next/navigation";

export default async function TagsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { title, sort } = await searchParams;

  let orderBy:
    | { createdAt?: "asc" | "desc"; name?: "asc" | "desc" }
    | undefined;

  switch (sort) {
    case "latest":
      orderBy = { createdAt: "desc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "a-z":
      orderBy = { name: "desc" };
      break;
    case "z-a":
      orderBy = { name: "asc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  const tags = await prisma.tag.findMany({
    where: {
      userId: user.id,
      name: title ? { contains: title, mode: "insensitive" } : undefined,
    },
    orderBy: orderBy,
    include: {
      notes: {
        select: { _count: true },
      },
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <FilterSort title={title} sort={sort} />
      <div className="flex flex-col gap-4">
        {tags.map((val) => (
          <CardTag key={val.id} tag={val} useCount={val.notes.length} />
        ))}
      </div>
    </div>
  );
}
