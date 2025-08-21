import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { companies, stats, testimonials } from "./_components/dummydata";
import Image from "next/image";
import JobPostForm from "@/components/general/JobPostForm";
import { prisma } from "@/lib/prisma";
import { checkUser } from "@/app/data/user/require-user";
import { redirect } from "next/navigation";

async function GetCompnayDetails(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      Company: {
        select: {
          name: true,
          logo: true,
          about: true,
          website: true,
          xAccount: true,
          location: true,
        },
      },
    },
  });

  if (!data?.Company) {
    return redirect("/");
  }

  return data.Company;
}

const PostJobPage = async () => {
  const session = await checkUser();

  const data = await GetCompnayDetails(session.user?.id as string);

  return (
    <div className="grid col-start-1 lg:grid-cols-3 gap-6 my-10">
      <div className="col-span-1 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-semibold">
              Post a New Job
            </CardTitle>
            <CardDescription>
              Fill out the details below to reach job seekers looking for their
              next opportunity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JobPostForm
              companyName={data?.name as string}
              companyLocation={data?.location as string}
              companyAbout={data?.about as string}
              companyLogo={data?.logo as string}
              companyWebsite={data?.website as string}
              companyXAccount={data?.xAccount as string}
            />
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Our Hiring Partners</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Discover top companies that trust our platform to find the right
              talent. Explore opportunities with industry leaders and innovative
              startups.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {companies.map((company) => (
                <Image
                  key={company.id}
                  src={company.logo}
                  alt={company.company_name}
                  height={100}
                  width={100}
                  className="rounded-xl opacity-60 hover:opacity-100 transition-all"
                />
              ))}
            </div>

            <div className="space-y-5">
              {testimonials.map((testimonial) => (
                <blockquote
                  key={testimonial.id}
                  className="border-l border-primary pl-4"
                >
                  <p className="text-sm text-muted-foreground italic">
                    "{testimonial.quote}"
                  </p>
                  <p className="text-sm font-bold mt-2">
                    - {testimonial.author} , {testimonial.company}
                  </p>
                </blockquote>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div key={stat.id} className="rounded-lg bg-muted p-4">
                  <h4 className="text-2xl font-bold">{stat.value}</h4>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default PostJobPage;
