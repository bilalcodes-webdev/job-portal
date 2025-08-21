// @ts-nocheck
import { checkUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, MapPin, DollarSign, Clock } from "lucide-react";
import Image from "next/image";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import JobCard from "../post-job/_components/JobCard";
import RenderEmptyState from "@/components/general/RenderEmptyState";

const getSavedJobs = async (userId: string) => {
  return await prisma.saveJobPost.findMany({
    where: { userId },
    select: {
      id: true,
      JobPost: {
        select: {
          id: true,
          Company: {
            select: {
              name: true,
              logo: true,
              website: true,
              xAccount: true,
            },
          },
          jobTitle: true,
          jobDescription: true,
          location: true,
          salaryTo: true,
          salaryFrom: true,
          employmentType: true,
          createdAt: true,
        },
      },
    },
  });
};
const SavedJobsPage = async () => {
  const session = await checkUser();
  const savedJobs = await getSavedJobs(session.user?.id as string);

  return (
    <div className="mt-12">
      <h1 className="text-3xl font-bold mb-8 md:text-left">Saved Jobs</h1>

      {savedJobs.length === 0 ? (
        <RenderEmptyState
          buttonText="Go to Jobs"
          href="/"
          description="You haven’t saved any jobs yet. Browse available jobs and save the ones you like."
          title="No Saved Job Found"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {savedJobs.map((job) => {
            const { JobPost } = job;
            const { Company } = JobPost;

            return (
              <JobCard
                key={job.id}
                id={job.JobPost.id}
                createdAt={JobPost.createdAt}
                Company={{
                  name: Company.name,
                  location: JobPost.location || "N/A",
                  about: "", // You can parse a short description from jobDescription if needed
                  logo: Company.logo || "",
                }}
                jobTitle={JobPost.jobTitle}
                location={JobPost.location}
                employmentType={JobPost.employmentType}
                salaryFrom={JobPost.salaryFrom}
                salaryTo={JobPost.salaryTo}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;
