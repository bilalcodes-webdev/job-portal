import JobPostForm from "@/components/general/JobPostForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

async function getMyJobs(postID: string) {
  return await prisma.jobPost.findUnique({
    where: {
      id: postID,
    },
    select: {
      id: true,
      jobTitle: true,
      jobDescription: true,
      createdAt: true,
      listingDuration: true,
      location: true,
      salaryFrom: true,
      salaryTo: true,
      status: true,
      employmentType: true,
      benefits: true,
      Company: {
        select: {
          id: true,
          name: true,
          logo: true,
          about: true,
          location: true,
          website: true,
          xAccount: true,
        },
      },
    },
  });
}

const EditPage = async ({
  params,
}: {
  params: Promise<{ editId: string }>;
}) => {
  const { editId } = await params;

  const data = await getMyJobs(editId);

  return (
    <div className="mt-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">Edit Post</CardTitle>
          <CardDescription>Here you can edit your job details</CardDescription>
        </CardHeader>
        <CardContent>
          <JobPostForm
            companyAbout={data?.Company.about as string}
            companyLocation={data?.Company.location as string}
            companyLogo={data?.Company.logo as string}
            companyName={data?.Company.name as string}
            companyWebsite={data?.Company.website as string}
            companyXAccount={data?.Company.xAccount as string}
            jobTitle={data?.jobTitle}
            jobDescription={data?.jobDescription}
            jobLocation={data?.location}
            employType={data?.employmentType}
            minSalary={data?.salaryFrom}
            maxSalary={data?.salaryTo}
            isEditing={true}
            benefits={data?.benefits}
            listingDuration={data?.listingDuration}
            postId={data?.id}
          />
        </CardContent>
      </Card>
    </div>
  );
};
export default EditPage;
