"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormUserSchema, UserSchema } from "@/lib/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function UserForm({ user }: { user: UserSchema }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormUserSchema),
  });

  const [loading, setLoading] = useState(false);
  const [editable, setEditable] = useState(false);

  const router = useRouter();

  async function onSubmit(formData: FormUserSchema) {
    setLoading(true);

    const res = await fetch(`/api/user/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
      }),
    });

    const bodyJson = await res.json();

    if (res.status === 401) {
      router.replace("/login");
      return;
    }

    if (!res.ok) {
      toast.error(bodyJson.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setEditable(false);
    toast.success(bodyJson.message);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <FieldSet disabled={loading}>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input
            {...register("name")}
            disabled={!editable}
            defaultValue={user.name}
            type="text"
            placeholder="Enter your name here"
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            {...register("email")}
            disabled={!editable}
            defaultValue={user.email}
            type="email"
            placeholder="Enter your email here"
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>
        {editable ? (
          <Field orientation="horizontal" className="justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditable(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </Field>
        ) : (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditable(true)}
            >
              Edit Profile
            </Button>
          </div>
        )}
      </FieldSet>
    </form>
  );
}
