// @ts-nocheck
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { checkUser } from "@/app/data/user/require-user";
import RenderEmptyState from "@/components/general/RenderEmptyState";
import { Badge } from "@/components/ui/badge";
import DeleteButton from "./_components/DeleteButton";

// Fetch jobs for the logged-in user's company
async function getMyJobs(userId: string) {
  return await prisma.jobPost.findMany({
    where: {
      Company: {
        userId: userId,
      },
    },
    select: {
      id: true,
      jobTitle: true,
      createdAt: true,
      status: true,
      Company: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
  });
}

const MyJobListing = async () => {
  const session = await checkUser();
  const jobs = await getMyJobs(session.user?.id as string);

  return (
    <div className="mt-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">My Jobs</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Manage your job listings and applications here
          </CardDescription>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <RenderEmptyState
              title="No Jobs Found"
              description="You haven't posted any jobs yet. Start by creating a new job listing."
              buttonText="Post a Job"
              href="/post-job"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      {job.Company.logo ? (
                        <Image
                          src={job.Company.logo}
                          alt={job.Company.name}
                          width={40}
                          height={40}
                          className="rounded-md"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full" />
                      )}
                    </TableCell>
                    <TableCell>{job.Company.name}</TableCell>

                    <TableCell>
                      <Badge
                        className={
                          job.status === "ACTIVE"
                            ? "bg-green-500" // green for Active (you can customize in Tailwind)
                            : job.status === "DRAFT"
                            ? "bg-yellow-500" // yellow
                            : "bg-red-500" // red or expired
                        }
                      >
                        {job.status.charAt(0).toUpperCase() +
                          job.status.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{job.jobTitle}</TableCell>
                    <TableCell>
                      {new Date(job.createdAt).toLocaleDateString("en-Us", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/edit-job/${job.id}`}
                              className="flex items-center gap-x-3"
                            >
                              <Pencil className="size-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          {/* ✅ Delete button ko standalone rakho */}
                          <DeleteButton
                            postId={job.id}
                            jobTitle={job.jobTitle}
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyJobListing;
