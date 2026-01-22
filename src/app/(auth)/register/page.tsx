"use client";

import InputPassword from "@/components/input-password";
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
import { Spinner } from "@/components/ui/spinner";
import { RegisterSchema } from "@/lib/type";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
  });

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function onSubmit(formData: RegisterSchema) {
    setLoading(true);

    const res = await fetch("/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    });

    const body = await res.json();

    if (!res.ok) {
      toast.error(body.message ?? "Unexpected error occured!");
      setLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-lg p-4 border rounded-md bg-background"
      >
        <FieldSet disabled={loading}>
          <FieldLegend>Sign-up</FieldLegend>
          <FieldDescription>
            Nice to meet you, let's get you signed up.
          </FieldDescription>

          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input {...register("name")} type="text" placeholder="John Doe" />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              {...register("email")}
              type="email"
              placeholder="johndoe@example.com"
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <InputPassword {...register("password")} />
            {errors.password && (
              <FieldError>{errors.password.message}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel>Confirm Password</FieldLabel>
            <InputPassword {...register("confirmPassword")} />
            {errors.confirmPassword && (
              <FieldError>{errors.confirmPassword.message}</FieldError>
            )}
          </Field>

          <Field>
            <Button type="submit">{loading && <Spinner />} Sign-up</Button>
            <Button variant="ghost" asChild>
              <Link href="/login">Sign-in to an existing account</Link>
            </Button>
          </Field>
        </FieldSet>
      </form>
    </div>
  );
}
