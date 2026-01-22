"use server";

import FilterSort from "@/components/filter-sort";
import NoteCard from "@/components/card-note";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma-client";
import { LucideNotepadTextDashed, LucidePlus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MainPage({
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
    | { createdAt?: "asc" | "desc"; title?: "asc" | "desc" }
    | undefined;

  switch (sort) {
    case "latest":
      orderBy = { createdAt: "desc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "a-z":
      orderBy = { title: "desc" };
      break;
    case "z-a":
      orderBy = { title: "asc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  const notes = await prisma.note.findMany({
    where: {
      userId: user.id,
      title: title ? { contains: title, mode: "insensitive" } : undefined,
    },
    orderBy: orderBy,
    include: { categories: true },
  });

  return (
    <div className="grow flex flex-col gap-4">
      <FilterSort title={title} sort={sort} />

      {notes.length > 0 ? (
        <div className="max-h-full overflow-y-scroll card-grid">
          {notes.map((val) => (
            <Link key={val.id} href={`/note/${val.id}`}>
              <NoteCard note={val} />
            </Link>
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LucideNotepadTextDashed />
            </EmptyMedia>
            <EmptyTitle>No Notes Found</EmptyTitle>
            <EmptyDescription>We couldn't find any notes.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/note/create">
                <LucidePlus />
                Create Note
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}
