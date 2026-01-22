"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateNote } from "@/lib/action-note";
import {
  FormNoteSchema,
  NoteSchema,
  NoteWithTagSchema,
  TagSchema,
} from "@/lib/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormNoteSchema),
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getNote();
  }, []);

  async function getNote() {
    setLoading(true);

    const result = await fetch(`/api/note/${id}`);

    const { note }: { note: NoteWithTagSchema } = await result.json();

    if (!result.ok) {
      router.replace("/");
    }

    setValue("title", note.title);
    setValue(
      "tags",
      note.categories
        .map((val) => `#${val.name}`)
        .toString()
        .replaceAll(",", " "),
    );
    setValue("content", note.content.replaceAll("<br />", "\n"));

    setLoading(false);
  }

  async function onSubmit(formData: FormNoteSchema) {
    setLoading(true);

    const result = await fetch(`/api/note/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.title,
        tags: formData.tags,
        content: formData.content?.replace(/\n/g, "<br />"),
      }),
    });

    const bodyJson = await result.json();

    if (result.status === 401) {
      router.replace("/login");
    }

    if (!result.ok) {
      toast.error(bodyJson.message);
      setLoading(false);
      return;
    }

    toast.success(bodyJson.message);
    setLoading(false);
    router.push(`/note/${id}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet disabled={loading}>
        <FieldLegend>Edit Note</FieldLegend>
        <FieldDescription>
          Fill the form below to edit the note.
        </FieldDescription>

        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input {...register("title")} type="text" placeholder="Cool Title" />
        </Field>
        <Field>
          <FieldLabel>Tags (Separate with #)</FieldLabel>
          <Input
            {...register("tags")}
            type="text"
            placeholder="#tag_one #tag_2 #cool#tags"
          />
        </Field>
        <Field>
          <FieldLabel>Content</FieldLabel>
          <Textarea
            {...register("content")}
            rows={10}
            placeholder="This is a very cool example."
            className="resize-none"
          />
        </Field>

        <Field orientation="horizontal" className="justify-end">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </Field>
      </FieldSet>
    </form>
  );
}
