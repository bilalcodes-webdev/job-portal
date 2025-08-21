import { createJobSeeker } from "@/app/actions/User";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { tryCatch } from "@/lib/try-catch";
import { UploadDropzone } from "@/lib/UploadThingsreexported";
import { UserSchema, UserSchemaType } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import pdfImage from "../../../../public/pdf.png"
const UserForm = () => {
  const [isPending, startTransion] = useTransition();
  const router = useRouter()
  const form = useForm<UserSchemaType>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      about: "",
      name: "",
      resume: "",
    },
  });

  const onSubmit = (values: UserSchemaType) => {
    startTransion(async () => {
      const { data, error } = await tryCatch(createJobSeeker(values));

      if (error) {
        toast.error("Something went wrong");
      }

      if (data?.status === "success") {
        toast.success(data.message);
        router.push("/");
      } else {
        if (data?.status === "error") {
          toast.error(data.message);
        }
      }
    });
  };
  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name.." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your about information..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume (PDF)</FormLabel>
              <FormControl>
                <div>
                  {field.value ? (
                    <div className="relative w-fit">
                      <Image
                        src={pdfImage}
                        alt="logo-image"
                        height={100}
                        width={100}
                        className="rounded-md"
                      />

                      {/* DELETE BUTTON */}
                      <button
                        type="button"
                        aria-label="Remove logo"
                        className="
                          absolute -top-2 -right-2
                          inline-flex items-center justify-center
                          h-8 w-8 rounded-full
                          bg-destructive text-destructive-foreground
                          shadow hover:opacity-90
                          focus:outline-none focus:ring-2 focus:ring-ring
                        "
                        // TODO: apna logic yahan lagao
                        onClick={() => field.onChange("")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <UploadDropzone
                      endpoint="resumeUploader"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].url);
                        toast.success("File uploaded successfully");
                      }}
                      onUploadError={() => {
                        toast.error("File upload failed");
                      }}
                      className="
                        border-2 border-primary rounded-lg p-4 
                        ut-button:bg-primary ut-button:text-white ut-button:border ut-button:border-primary
                        ut-button:hover:bg-primary/90
                        ut-label:text-muted-foreground
                        ut-allowed-content:text-sm ut-allowed-content:text-muted-foreground
                      "
                    />
                  )}
                </div>
              </FormControl>
              {/* layout stable rakho */}
              <div className="min-h-[20px]">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-1 size-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Briefcase className="mr-1 size-4" />
              Submit
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};
export default UserForm;
