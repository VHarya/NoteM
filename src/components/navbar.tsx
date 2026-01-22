"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import {
  LucideLogOut,
  LucidePlus,
  LucideTags,
  LucideUser2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { cn, getAbbreviation } from "@/lib/utils";
import { FormTagSchema, UserSchema } from "@/lib/type";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Spinner } from "./ui/spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { toast } from "sonner";

export default function Navbar({ user }: { user: UserSchema }) {
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors: formErrors },
  } = useForm({
    resolver: zodResolver(FormTagSchema),
  });

  const [loading, setLoading] = useState(false);
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  async function onCreateTag(formData: FormTagSchema) {
    setLoading(true);

    const result = await fetch("/api/tag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
      }),
    });

    const bodyJson = await result.json();

    resetField("name");
    setShowCreateTag(false);
    setLoading(false);

    if (!result.ok) {
      toast.error(bodyJson.message);
      return;
    }

    router.refresh();
  }

  async function logout() {
    setLoading(true);
    const result = await fetch("/api/user/logout", {
      method: "POST",
    });

    if (!result.ok) {
      setLoading(false);
      return;
    }

    router.replace("/login");
  }

  return (
    <>
      <div className="py-6 flex justify-between">
        <Link href="/">
          <span className="text-2xl font-bold">NoteM</span>
        </Link>

        <div className="flex gap-4">
          {pathname === "/tags" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateTag(true)}
            >
              <LucidePlus />
              Create Tag
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/note/create">
                <LucidePlus strokeWidth={2.15} />
                Create Note
              </Link>
            </Button>
          )}

          <DropdownMenu open={showAvatarMenu} onOpenChange={setShowAvatarMenu}>
            <DropdownMenuTrigger
              className={cn(
                "rounded-full transition-[color,box-shadow] shadow-xs outline-none",
                "focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px]",
              )}
            >
              <Avatar onClick={() => setShowAvatarMenu(!showAvatarMenu)}>
                <AvatarFallback>{getAbbreviation(user.name)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="p-2 flex items-center gap-2">
                <Avatar className="size-9">
                  <AvatarFallback>{getAbbreviation(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col select-none pointer-events-none">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={"/user"}>
                  <LucideUser2 />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={"/tags"}>
                  <LucideTags />
                  Manage Tags
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={logout}>
                <LucideLogOut />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={showCreateTag} onOpenChange={setShowCreateTag}>
        <DialogContent
          showCloseButton={false}
          onInteractOutside={(e) => loading && e.preventDefault()}
          onEscapeKeyDown={(e) => loading && e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Create Tag</DialogTitle>
            <DialogDescription>
              Write the tag name below and submit your tag.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onCreateTag)} className="flex flex-col">
            <Input
              {...register("name")}
              type="text"
              placeholder="#example_tag"
              disabled={loading}
            />
            {formErrors.name && (
              <span className="mt-2 text-sm text-destructive">
                {formErrors.name.message}
              </span>
            )}
          </form>

          <DialogFooter>
            <DialogClose disabled={loading} asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button disabled={loading} onClick={handleSubmit(onCreateTag)}>
              {loading && <Spinner />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
