"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormNoteSchema } from "@/lib/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function CreatePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormNoteSchema),
  });

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function onSubmit(formData: FormNoteSchema) {
    setLoading(true);

    const result = await fetch("/api/note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.title,
        tags: formData.tags,
        content: formData.content?.replace(/\n/g, "<br />"),
      }),
    });

    if (result.status === 401) {
      router.replace("/login");
    }

    if (!result.ok) {
      setLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet disabled={loading}>
        <FieldLegend>Create Note</FieldLegend>
        <FieldDescription>
          Fill the form below to create a new note.
        </FieldDescription>

        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input {...register("title")} type="text" placeholder="Cool Title" />
          {errors.title && <FieldError>{errors.title.message}</FieldError>}
        </Field>
        <Field>
          <FieldLabel>Tags (Separate with #)</FieldLabel>
          <Input
            {...register("tags")}
            type="text"
            placeholder="#tag_one #tag_2 #cool#tags"
          />
          {errors.tags && <FieldError>{errors.tags.message}</FieldError>}
        </Field>
        <Field>
          <FieldLabel>Content</FieldLabel>
          <Textarea
            {...register("content")}
            rows={10}
            placeholder="This is a very cool example."
            className="resize-none"
          />
          {errors.content && <FieldError>{errors.content.message}</FieldError>}
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
