"use server";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getCurrentUser } from "@/lib/auth";
import { getAbbreviation } from "@/lib/utils";
import { redirect } from "next/navigation";
import UserForm from "./form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default async function UserPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      <h1 className="text-lg font-medium">My Profile</h1>

      <div className="flex gap-4">
        <Avatar className="size-16 text-3xl">
          <AvatarFallback>{getAbbreviation(user.name)}</AvatarFallback>
        </Avatar>

        <UserForm user={user} />
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="text-destructive/75 hover:text-destructive hover:bg-destructive/5"
            >
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Your account will be permanently deleted and <b>won't</b> be
                recoverable.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button variant="destructive">Yes, I'm sure</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
