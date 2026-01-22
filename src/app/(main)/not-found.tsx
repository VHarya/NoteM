"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { LucideArrowLeft, LucideTriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <Empty className="grow mb-10 flex flex-col justify-center items-center gap-4">
      <EmptyHeader className="flex flex-col items-center gap-2">
        <EmptyMedia variant="icon" className="p-2 rounded-md bg-accent">
          <LucideTriangleAlert />
        </EmptyMedia>
        <EmptyTitle className="text-2xl font-medium">404</EmptyTitle>
        <EmptyDescription>Page not found.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <LucideArrowLeft />
          Go Back
        </Button>
      </EmptyContent>
    </Empty>
  );
}
