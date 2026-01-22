"use server";

import Navbar from "@/components/navbar";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma-client";
import { UserSchema } from "@/lib/type";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function MainLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="w-[90%] sm:w-[75%] md:w-[70%] lg:w-[65%] xl:w-[60%] h-screen flex flex-col">
      <Navbar user={user} />
      {children}
    </div>
  );
}
