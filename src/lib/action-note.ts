"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";
import { FormNoteSchema } from "./type";
import z from "zod";
import prisma from "./prisma-client";
import { formatTagsToArray } from "./utils";
import { revalidatePath } from "next/cache";
import { error } from "console";

export async function updateNote(id: string, formData: FormNoteSchema) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // const parseResult = FormNoteSchema.safeParse({
  //   title: formData.get("title"),
  //   content: formData.get("content"),
  //   tags: formData.get("tags"),
  // });

  // if (!parseResult.success) {
  //   const errors = z.flattenError(parseResult.error);
  //   return { message: "Invalid inputs", error: errors.fieldErrors };
  // }

  try {
    await prisma.$transaction(async (tx) => {
      const tagList = formatTagsToArray(formData.tags ?? "");

      let tagIds = [];
      for (const tagName of tagList) {
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
          title: formData.title,
          content: formData.content,
          userId: user.id,
          categories: {
            set: tagIds.map((val) => ({ id: val })),
          },
        },
        where: { id: id },
      });
    });

    revalidatePath(`/note/${id}`);
    return { message: "Successfully updated data.", error: null };
  } catch (error: any) {
    console.error(error);

    if (error.message === "note-not-found") {
      return { message: "Couldn't find this note.", error: true };
    }

    return { message: "An unexpected error occured!", error: true };
  }
}
