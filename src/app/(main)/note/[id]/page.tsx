"use server";

import NoteDropdown from "@/components/dropdown-note";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma-client";
import dayjs from "dayjs";
import { notFound } from "next/navigation";

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const note = await prisma.note.findUnique({
    where: { id: id },
    include: { categories: true },
  });

  if (!note) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="grow flex flex-col gap-1">
          <h1 className="text-lg font-medium">{note.title}</h1>
          <span className="text-sm">
            {dayjs(note.createdAt).format("DD MMMM YYYY HH:mm")}
          </span>
          <div className="grow flex flex-wrap gap-2">
            {note.categories.map((val) => (
              <Badge key={val.id} variant="outline" className="shrink-0">
                #{val.name}
              </Badge>
            ))}
          </div>
        </div>

        <NoteDropdown noteId={note.id} />
      </div>

      <p
        className="text-sm"
        dangerouslySetInnerHTML={{ __html: note.content }}
      ></p>
    </div>
  );
}
