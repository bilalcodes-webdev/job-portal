"use client";
import { deletePost } from "@/app/actions/jobPost";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { tryCatch } from "@/lib/try-catch";
import { Loader2, Trash } from "lucide-react";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const DeleteButton = ({
  postId,
  jobTitle,
}: {
  postId: string;
  jobTitle: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const { data, error } = await tryCatch(deletePost(postId));

      if (error) {
        toast.error("Something Went Wrong");
        return;
      }

      if (data?.status === "success") {
        toast.success(data.message);
        setOpen(false); // close dialog
        router.refresh(); // list turant update ho jaye
      } else if (data?.status === "error") {
        toast.error(data.message);
      }
    });
  };

  return (
    <>
      {/* Ye dropdown item sirf dialog open karega */}
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault(); // prevent auto-close behaviour
          setOpen(true);
        }}
        className="flex items-center gap-x-2 text-red-600 focus:text-red-600"
      >
        <Trash className="size-4 mr-1" />
        Delete
      </DropdownMenuItem>

      {/* Controlled Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader className="items-start text-left">
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{jobTitle}</span>? <br />
              This action is <b>permanent</b> and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={isPending}
              variant="destructive"
              onClick={handleDelete}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-1 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="mr-1 size-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteButton;
