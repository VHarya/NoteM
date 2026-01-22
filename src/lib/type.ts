import z from "zod";

export const UserSchema = z.object({
  id: z.string().nonempty("ID cannot be empty."),
  name: z.string(),
  email: z.email(),
});
export type UserSchema = z.infer<typeof UserSchema>;

export const TagSchema = z.object({
  id: z.string().nonempty("ID cannot be empty."),
  name: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type TagSchema = z.infer<typeof TagSchema>;

export const NoteSchema = z.object({
  id: z.string().nonempty("ID cannot be empty."),
  title: z.string(),
  content: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type NoteSchema = z.infer<typeof NoteSchema>;

export type NoteWithTagSchema = { categories: TagSchema[] } & NoteSchema;

export const LoginSchema = z.object({
  email: z.email().nonempty("Email cannot be empty."),
  password: z.string().nonempty("Password cannot be empty."),
  remember: z.boolean().default(false),
});
export type LoginSchema = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .nonempty("Name cannot be empty.")
      .min(2, "Must be at least 2 characters."),
    email: z.email().nonempty("Email cannot be empty."),
    password: z
      .string()
      .nonempty("Password cannot be empty.")
      .min(6, "Must be at least 6 characters."),
    confirmPassword: z.string().nonempty("Confirm Password cannot be empty."),
  })
  .refine((tx) => tx.password === tx.confirmPassword, {
    error: "Password and Confirm Password does not match.",
    path: ["confirmPassword"],
  });
export type RegisterSchema = z.infer<typeof RegisterSchema>;

export const FilterSortSchema = z.object({
  title: z.string().optional(),
  sort: z.enum(["latest", "oldest", "a-z", "z-a"]).default("latest"),
});
export type FilterSortSchema = z.infer<typeof FilterSortSchema>;

export const FormNoteSchema = z.object({
  title: z.string().nonempty("Title cannot be empty."),
  tags: z.string().optional(),
  content: z.string().optional(),
});
export type FormNoteSchema = z.infer<typeof FormNoteSchema>;

export const FormTagSchema = z.object({
  name: z.string().nonempty("Name cannot be empty."),
});
export type FormTagSchema = z.infer<typeof FormTagSchema>;

export const FormUserSchema = z.object({
  name: z.string().nonempty("Name cannot be empty"),
  email: z.email().nonempty("Email cannot be empty"),
});
export type FormUserSchema = z.infer<typeof FormUserSchema>;
