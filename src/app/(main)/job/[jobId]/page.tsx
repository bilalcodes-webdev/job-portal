import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { benefits } from "../../post-job/_components/ListOfbenefits";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getFlagUrlByLocation } from "@/lib/CountryList";
import { SaveJobButton } from "./_components/SavedJobButton";

async function getJobWithSavedStatus(jobId: string, userId?: string) {
  const jobPromise = prisma.jobPost.findUnique({
    where: { id: jobId, status: "ACTIVE" },
    select: {
      jobTitle: true,
      jobDescription: true,
      location: true,
      employmentType: true,
      benefits: true,
      createdAt: true,
      listingDuration: true,
      Company: {
        select: { name: true, logo: true, location: true, about: true },
      },
    },
  });

  const savedJobPromise = userId
    ? prisma.saveJobPost.findUnique({
        where: {
          userId_jobPostId: {
            jobPostId: jobId,
            userId: userId,
          },
        },
        select: { id: true },
      })
    : Promise.resolve(null);

  const [job, savedJob] = await Promise.all([jobPromise, savedJobPromise]);

  if (!job) return notFound();
  return { job, savedJob };
}

const JobDetailPage = async ({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) => {
  const { jobId } = await params;
  const session = await auth();

  const { job, savedJob } = await getJobWithSavedStatus(
    jobId,
    session?.user?.id
  );
  const flag = getFlagUrlByLocation(job.location);

  return (
    <div className="grid lg:grid-cols-3 gap-6 my-12">
      <div className="space-y-8 col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl">{job.Company.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <p className="font-bold">{job.jobTitle}</p>
              <span className="text-muted-foreground">*</span>

              <Badge className="rounded-full" variant={"secondary"}>
                {job.employmentType}
              </Badge>

              <span className="text-muted-foreground">*</span>
              <Badge className="rounded-full flex items-center gap-2">
                <Image
                  src={flag as string}
                  alt={job.location}
                  height={25}
                  width={25}
                />
                {job.location}
              </Badge>
            </div>
          </div>

          <SaveJobButton
            postId={jobId}
            initialSaved={!!savedJob}
            savedPostId={savedJob?.id}
            userId={session?.user?.id}
          />
        </div>

        <section className="py-4">
          <h4 className="text-xl font-bold mb-2 uppercase">Job Description:</h4>
          <RenderDescription json={JSON.parse(job.jobDescription)} />
        </section>

        <section>
          <h4 className="text-xl font-bold mb-2 uppercase">Job Benefits:</h4>
          <div className="flex items-center gap-3 flex-wrap">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              const isOffered = job.benefits.includes(benefit.id);
              return (
                <Badge
                  key={benefit.id}
                  variant={isOffered ? "default" : "outline"}
                  className={cn(
                    isOffered
                      ? ""
                      : "cursor-not-allowed opacity-75 px-2 py-1.5 rounded-full"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-3 h-3" />
                    {benefit.label}
                  </span>
                </Badge>
              );
            })}
          </div>
        </section>
      </div>

      <div className="col-span-1 space-y-4">
        <Card className="p-6">
          <h3 className="font-semibold">About the Job</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Apply Before
              </span>
              <span className="text-sm">
                {new Date(
                  job.createdAt.getTime() +
                    job.listingDuration * 24 * 60 * 60 * 1000
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Job Created</span>
              <span className="text-sm">
                {job.createdAt.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Employment Type
              </span>
              <span className="text-sm capitalize">{job.employmentType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Job Location
              </span>
              <span className="text-sm capitalize">
                <Badge
                  variant={"secondary"}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={flag as string}
                    alt={job.location}
                    height={20}
                    width={20}
                  />
                  {job.location}
                </Badge>
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Image
              src={job.Company.logo}
              height={48}
              width={48}
              alt={job.jobTitle}
              className="rounded-md"
            />
            <div className="flex flex-col">
              <h3 className="font-semibold">{job.Company.name}</h3>
              <h3 className="text-xs text-muted-foreground line-clamp-2">
                {job.Company.about}
              </h3>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JobDetailPage;
