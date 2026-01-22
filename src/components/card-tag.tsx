"use client";

import { FormTagSchema, TagSchema } from "@/lib/type";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LucideEllipsisVertical } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "./ui/spinner";
import { FieldError, FieldSet } from "./ui/field";

export default function CardTag({
  tag,
  useCount,
}: {
  tag: TagSchema;
  useCount: number;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm({
    resolver: zodResolver(FormTagSchema),
  });

  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const router = useRouter();

  async function onEditClicked(formData: FormTagSchema) {
    setLoading(true);

    const res = await fetch(`/api/tag/${tag.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
      }),
    });

    const bodyJson = await res.json();

    setShowEdit(false);
    setLoading(false);

    if (!res.ok) {
      toast.error(bodyJson.message);
      return;
    }

    router.refresh();
  }

  async function onDeleteClicked() {
    setLoading(true);

    const res = await fetch(`/api/tag/${tag.id}`, {
      method: "DELETE",
    });

    const bodyJson = await res.json();

    setLoading(false);

    if (!res.ok) {
      toast.error(bodyJson.message);
      return;
    }

    router.refresh();
  }

  return (
    <>
      <div className="p-4 flex flex-col gap-2 border rounded-md">
        <div className="flex justify-between gap-2">
          <span className="text-sm font-medium">#{tag.name}</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-xs">
                <LucideEllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowEdit(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setShowDelete(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex justify-between gap-2">
          <span className="w-fit text-xs">Used in {useCount} note(s)</span>
          <span className="w-fit text-xs">
            {dayjs(tag.createdAt).format("DD MMMM YYYY HH:mm")}
          </span>
        </div>
      </div>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>
              Write the tag name below and submit your tag.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onEditClicked)}>
            <FieldSet>
              <Input
                {...register("name")}
                type="text"
                defaultValue={`#${tag.name}`}
                placeholder="#example_tag"
                disabled={loading}
              />
              {formErrors.name && (
                <FieldError>{formErrors.name.message}</FieldError>
              )}
            </FieldSet>
          </form>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              onClick={handleSubmit(onEditClicked)}
            >
              {loading && <Spinner />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Once the data is deleted, it won't be recoverable.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={loading}
              onClick={onDeleteClicked}
            >
              {loading && <Spinner />}I understand
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
