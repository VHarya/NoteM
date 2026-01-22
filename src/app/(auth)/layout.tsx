"use server";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return children;
}
