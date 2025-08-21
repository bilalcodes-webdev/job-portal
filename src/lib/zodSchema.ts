import { z } from "zod";

export const companySchema = z.object({
  name: z
    .string()
    .min(3, { message: "Company name must be at least 3 characters" }),
  location: z.string().min(1, { message: "Location is required" }),
  about: z
    .string()
    .min(10, { message: "About must me at least 10 characters" }),
  logo: z.string().min(1, { message: "Comapny logo is require" }),
  website: z.string().url("Please enter valid Url"),
  xAccount: z.string().optional(),
});
export const UserSchema = z.object({
  name: z.string().min(4, { message: "Name must be at leat 4 characters" }),
  about: z
    .string()
    .min(10, { message: "About must be at least 10 characters long" }),
  resume: z.string().min(1, { message: "Resume is required" }),
});

export const JobPostSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  employmentType: z.string().min(1, "Employment type is required"),
  location: z.string().min(1, "Location is required"),
  salaryFrom: z
    .number()
    .nonnegative()
    .min(1, { message: "Salary is required" }),
  salaryTo: z.number().nonnegative().min(1, { message: "Salary is required" }),
  jobDescription: z
    .string()
    .min(10, "Job description should be at least 10 characters"),
  listingDuration: z
    .number()
    .positive()
    .min(1, { message: "Listing duration is required" }),
  benefits: z
    .array(z.string())
    .min(1, { message: "At lest one benefit required" }),
  companyName: z.string().min(1, "Company name is required"),
  companyLocation: z.string().min(1, "Location is required"),
  companyAbout: z.string().min(1, "About is required"),
  companyLogo: z.string().url("Logo must be a valid URL"),
  companyWebsite: z.string().url("Website must be a valid URL"),
  companyXAccount: z.string().optional(),
});

export type CompanySchemaType = z.infer<typeof companySchema>;
export type UserSchemaType = z.infer<typeof UserSchema>;
export type JobPostSchemaType = z.infer<typeof JobPostSchema>;
