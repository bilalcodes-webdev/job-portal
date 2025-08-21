"use client";

import { JobPostSchemaType, JobPostSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { countryList } from "@/lib/CountryList";
import SalaryRange from "./SalaryRange";
import ReichTextEditor from "../rich-text-editor/RichTextEditor";
import Benefits from "./Benefits";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { UploadDropzone } from "@/lib/UploadThingsreexported";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import JobListingPrice from "./JobListingPrice";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { tryCatch } from "@/lib/try-catch";
import { createJobPost, editJobPost } from "@/app/actions/jobPost";
import { useRouter } from "next/navigation";

type JobPostProps = {
  companyName: string;
  companyLocation: string;
  companyAbout: string;
  companyWebsite: string;
  companyLogo: string;
  isEditing?: boolean;
  jobTitle?: string;
  jobDescription?: string;
  companyXAccount: string;
  jobLocation?: string;
  employType?: string;
  minSalary?: number;
  benefits?: string[];
  maxSalary?: number;
  listingDuration?: number;
  postId?: string;
};

const JobPostForm = ({
  companyName,
  companyLocation,
  companyAbout,
  companyWebsite,
  companyLogo,
  companyXAccount,
  jobDescription,
  jobTitle,
  jobLocation,
  employType,
  minSalary,
  maxSalary,
  isEditing = false,
  benefits,
  listingDuration,
  postId,
}: JobPostProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<JobPostSchemaType>({
    resolver: zodResolver(JobPostSchema),
    defaultValues: {
      benefits: benefits || [],
      companyAbout,
      companyLocation,
      companyLogo,
      companyName,
      companyWebsite,
      companyXAccount: companyXAccount || "",
      employmentType: employType || "",
      jobDescription: jobDescription || "",
      jobTitle: jobTitle || "",
      listingDuration: listingDuration || 30,
      location: jobLocation || "",
      salaryFrom: minSalary || 0,
      salaryTo: maxSalary || 0,
    },
  });

  const postJobForm = (values: JobPostSchemaType) => {
    startTransition(async () => {
      const { data, error } = await tryCatch(
        !isEditing
          ? createJobPost(values)
          : editJobPost(values, postId as string)
      );

      if (error) {
        toast.error("Unexpected error occurs, please try again");
      }

      if (data?.status === "success") {
        toast.success(data.message);
        router.push("/");
      } else if (data?.status === "error") {
        toast.error(data.message);
      }
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(postJobForm)}>
        {/* Job Info */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your job title here.."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Employment Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel className="text-md">
                          Employment Types
                        </SelectLabel>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Location</FormLabel>
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

            <FormField
              control={form.control}
              name="salaryFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <SalaryRange
                      control={form.control}
                      currency="USD"
                      maxSalary={1000000}
                      minSalary={10000}
                      step={1000}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <ReichTextEditor field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="benefits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Benefits</FormLabel>
                <FormControl>
                  <Benefits field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Company Info */}
        <Card>
          <CardHeader>
            <CardTitle>Company Info</CardTitle>
            <CardDescription>Company information is read-only</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "companyName", label: "Company Name" },
              { name: "companyLocation", label: "Company Location" },
              { name: "companyWebsite", label: "Company Website" },
              { name: "companyXAccount", label: "X(Twitter) Account" },
              { name: "companyAbout", label: "Company About" },
            ].map((fieldData) => (
              <FormField
                key={fieldData.name}
                control={form.control}
                name={fieldData.name as keyof JobPostSchemaType}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fieldData.label}</FormLabel>
                    <FormControl>
                      {fieldData.name === "companyAbout" ? (
                        <Textarea
                          placeholder={`Write something about your company`}
                          {...field}
                          disabled
                          className="min-h-[120px]"
                        />
                      ) : (
                        <Input
                          placeholder={fieldData.label}
                          {...field}
                          disabled
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            {/* Company Logo */}
            <FormField
              control={form.control}
              name="companyLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Logo</FormLabel>
                  <FormControl>
                    {field.value ? (
                      <div className="relative w-fit">
                        <Image
                          src={field.value}
                          alt="logo-image"
                          height={150}
                          width={150}
                          className="rounded-md"
                        />
                      </div>
                    ) : (
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) =>
                          field.onChange(res[0].url)
                        }
                        onUploadError={() => {}}
                        className="border-2 border-primary rounded-lg p-4"
                        disabled
                      />
                    )}
                  </FormControl>
                  <div className="min-h-[20px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Listing Duration */}
        {!isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>Job Listing Info</CardTitle>
              <CardDescription>
                Write details about your job listing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="listingDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Listing Duration</FormLabel>
                    <FormControl>
                      <JobListingPrice field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}{" "}
          {isEditing ? "Update Post" : "Create Post"}
        </Button>
      </form>
    </Form>
  );
};

export default JobPostForm;
