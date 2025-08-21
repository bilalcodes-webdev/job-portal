"use client"

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";
import { useFormStatus } from "react-dom";

const SubmitButton = ({ children }: { children: ReactNode }) => {
  const { pending } = useFormStatus();
  return (
    <Button variant={"outline"} disabled={pending} className="w-full flex items-center gap-2">
      {pending ? (
        <>
          <Loader2 className="mr-1 size-4 animate-spin" />
          Submitting...
        </>
      ) : (
        <>{children}</>
      )}
    </Button>
  );
};
export default SubmitButton;
