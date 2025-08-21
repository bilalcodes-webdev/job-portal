"use client";

import { useForm } from "react-hook-form";
import { companySchema, CompanySchemaType } from "./../../../lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryList } from "@/lib/CountryList";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/lib/UploadThingsreexported";
import { toast } from "sonner";
import "@uploadthing/react/styles.css";
import { useTransition } from "react";
import { tryCatch } from "@/lib/try-catch";
import { createCompany } from "@/app/actions/company";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Building2, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";

const CompanyForm = () => {
  const [isPending, startTransion] = useTransition();
  const router = useRouter();

  const form = useForm<CompanySchemaType>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      location: "",
      about: "",
      logo: "",
      website: "",
      xAccount: "",
    },
  });

  const onSubmit = (values: CompanySchemaType) => {
    startTransion(async () => {
      const { data, error } = await tryCatch(createCompany(values));

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
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Company Name + Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your company name.." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Location</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="text-md">Worldwide</SelectLabel>
                      <SelectItem value="worldwide">
                        <span>🌏</span> <span>Worldwide / Remote</span>
                      </SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel className="text-md">Locations</SelectLabel>
                      {countryList.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          <Image
                            src={country.flagUrl}
                            alt={country.code}
                            height={15}
                            width={15}
                          />
                          <span className="pl-2">{country.name}</span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Website + X Account */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="xAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>X(Twitter) Account</FormLabel>
                <FormControl>
                  <Input placeholder="@accountname" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* About */}
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company About</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your company detail..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Logo Upload */}
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Logo</FormLabel>
              <FormControl>
                <div>
                  {field.value ? (
                    <div className="relative w-fit">
                      <Image
                        src={field.value}
                        alt="logo-image"
                        height={150}
                        width={150}
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
                      endpoint="imageUploader"
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
              Creating Company...
            </>
          ) : (
            <>
              <Building2 className="mr-1 size-4" />
              Create Company
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CompanyForm;
