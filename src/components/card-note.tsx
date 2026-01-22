import { NoteSchema, NoteWithTagSchema } from "@/lib/type";
import { Badge } from "./ui/badge";
import dayjs from "dayjs";
import { Note, Tag } from "@/generated/prisma/client";

export default function NoteCard({
  note,
}: {
  note: { categories: Tag[] } & Note;
}) {
  return (
    <div className="h-full p-4 flex flex-col gap-2 bg-background border rounded-md select-none">
      <div className="flex flex-col">
        <h1 className="font-medium">{note.title}</h1>
        <span className="text-xs text-muted-foreground">
          {dayjs(note.createdAt).format("DD MMMM YYYY HH:mm")}
        </span>
      </div>
      <div className="mb-auto text-sm text-muted-foreground line-clamp-3">
        {note.content.replaceAll("<br />", " ")}
      </div>
      <div className="flex gap-2 overflow-hidden">
        {note.categories.map((val) => (
          <Badge key={val.id} variant="outline" className="shrink-0">
            #{val.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}

// <Badge variant="outline">#tag_a</Badge>
