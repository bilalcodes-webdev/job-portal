"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { savedJob, unsavedJob } from "@/app/actions/jobPost";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { tryCatch } from "@/lib/try-catch";
import { toast } from "sonner";

interface SaveJobButtonProps {
  postId: string;
  initialSaved: boolean;
  userId?: string | null;
  savedPostId?: string;
}

export const SaveJobButton: React.FC<SaveJobButtonProps> = ({
  postId,
  initialSaved,
  userId,
  savedPostId,
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!userId) {
      router.push("/login");
      return;
    }

    startTransition(async () => {
      const { data, error } = await tryCatch(
        initialSaved ? unsavedJob(savedPostId as string) : savedJob(postId)
      );

      if (error) {
        toast.error("Something went wrong");
      }

      if (data?.status === "success") {
        toast.success(data.message);
      } else {
        if (data?.status === "error") {
          toast.error(data.message);
        }
      }
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Button type="submit" variant={"outline"} disabled={isPending}>
        <Heart
          className={cn(
            "w-4 h-4",
            initialSaved ? "text-red-500" : "text-gray-500"
          )}
          fill={initialSaved ? "currentColor" : "none"}
        />
        {isPending
          ? "Processing..."
          : initialSaved
          ? "Saved"
          : "Favourite"}
      </Button>
    </form>
  );
};
