"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LucideEdit3, LucideEllipsisVertical, LucideTrash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NoteDropdown({ noteId }: { noteId: string }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function onDeleteConfirm() {
    setLoading(true);

    const result = await fetch(`/api/note/${noteId}`, {
      method: "DELETE",
    });

    if (!result.ok) {
      const { message } = await result.json();

      toast.error(message);
      setLoading(false);
      return;
    }

    router.replace("/");
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <LucideEllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a href={`/note/edit/${noteId}`}>
              <LucideEdit3 />
              Edit
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setOpenDialog(!openDialog)}
          >
            <LucideTrash />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The note will be permanently deleted
              and won't be recoverable.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="ghost">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => onDeleteConfirm()} asChild>
              <Button className="bg-destructive hover:bg-destructive/85">
                Yes, Delete Note
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
