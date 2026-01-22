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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { LucideEyeOff } from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/type";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import InputPassword from "@/components/input-password";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: { remember: true },
  });

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function onSubmit(formData: LoginSchema) {
    setLoading(true);

    console.log(formData);

    const res = await fetch("/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        remember: formData.remember,
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
          <FieldLegend>Sign-in</FieldLegend>
          <FieldDescription>
            Welcome back, let's get you signed in.
          </FieldDescription>
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
          <Field orientation="horizontal">
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="remember-me"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <FieldLabel htmlFor="remember-me">Remember Me</FieldLabel>
          </Field>

          <Field>
            <Button type="submit">{loading && <Spinner />} Sign-in</Button>
            <Button variant="ghost" asChild>
              <Link href="/register">Create a new account</Link>
            </Button>
          </Field>
        </FieldSet>
      </form>
    </div>
  );
}
