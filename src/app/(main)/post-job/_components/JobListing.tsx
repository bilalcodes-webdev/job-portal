// @ts-nocheck
import RenderEmptyState from "@/components/general/RenderEmptyState";
import { prisma } from "@/lib/prisma";
import JobCard from "./JobCard";

interface JobListingProps {
  jobType?: string;
  location?: string;
}

const getPosts = async ({ jobType, location }: JobListingProps) => {
  const where: Record<string, any> = {
    status: "ACTIVE",
  };

  // jobType filter
  if (jobType) {
    where.employmentType = jobType;
  }

  // location filter
  if (location) {
    const loc = location.trim().toLowerCase();
    if (loc !== "worldwide") {
      where.location = {
        contains: location,
        mode: "insensitive",
      };
    }
  }

  return prisma.jobPost.findMany({
    where,
    select: {
      jobTitle: true,
      id: true,
      salaryFrom: true,
      salaryTo: true,
      employmentType: true,
      location: true,
      createdAt: true,
      Company: {
        select: {
          name: true,
          logo: true,
          location: true,
          about: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const JobListing = async ({ jobType, location }: JobListingProps) => {
  const jobs = await getPosts({ jobType, location });

  return (
    <>
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <JobCard
            key={job.id}
            Company={job.Company}
            createdAt={job.createdAt}
            employmentType={job.employmentType}
            id={job.id}
            jobTitle={job.jobTitle}
            location={job.location}
            salaryFrom={job.salaryFrom}
            salaryTo={job.salaryTo}
          />
        ))
      ) : (
        <RenderEmptyState
          buttonText="Clear all filters"
          description="Try different search for a job title or description"
          href="/"
          title="No Job Found"
        />
      )}
    </>
  );
};

export default JobListing;
