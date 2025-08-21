import { prisma } from "@/lib/prisma";
import { inngest } from "../client";
import { resend } from "@/lib/resend";

// ----------------- Job Expiry -----------------
export const JobPostExpiry = inngest.createFunction(
  { id: "job-created" },
  { event: "postjob/created" },
  async ({ event, step }) => {
    const { postId, expirationDate } = event.data;

    // wait until expiration (ISO 8601 format → P{n}D = n days)
    await step.sleep("wait-for-expiration", `P${expirationDate}D`);

    // update status
    const post = await step.run("job-status-update", async () => {
      return prisma.jobPost.update({
        where: { id: postId },
        data: { status: "EXPIRED" },
      });
    });

    return { postId, status: 200 };
  }
);

// ----------------- Job Periodic Notification -----------------
export const jobPeriodicNotification = inngest.createFunction(
  { id: "send-job-notification" },
  { event: "jobseeker/created" },
  async ({ event, step }) => {
    let currentDay = 0;
    const interval = 2; // every 2 days
    const totalDay = 30; // run for 30 days

    const { email } = event.data;

    while (currentDay < totalDay) {
      // sleep (for testing: 30 sec → "PT30S", for real: 2 days → `P${interval}D`)
      await step.sleep("wait-interval", `P${interval}D`);
      currentDay += interval;

      await step.run("fetch-jobs", async () => {
        const recentJob = await prisma.jobPost.findMany({
          where: { status: "ACTIVE" },
          include: {
            Company: { select: { name: true, website: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 4,
        });

        if (recentJob.length > 0) {
          await step.run("send-email", async () => {
            const { data, error } = await resend.emails.send({
              // 🔹 Testing ke liye sandbox sender
              from: "Jobs <onboarding@resend.dev>",
              to: [email],
              subject: "✨ New Job Openings for You",
              html: `
                <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
                  <h2 style="color:#4F46E5;">Latest Job Opportunities</h2>
                  <p>Here are some recent jobs you might be interested in:</p>

                  ${recentJob
                    .map(
                      (job) => `
                        <div style="border:1px solid #e5e7eb; border-radius:8px; padding:12px 16px; margin-bottom:16px;">
                          <h3 style="margin:0; font-size:16px; color:#111827;">${job.jobTitle}</h3>
                          <p style="margin:4px 0; font-size:14px; color:#374151;">
                            🏢 ${job.Company.name} <br />
                            📍 ${job.location} <br />
                            💰 $${job.salaryFrom} - $${job.salaryTo} <br />
                            🌐 <a href="${job.Company.website}" style="color:#4F46E5; text-decoration:none;">
                              ${job.Company.website}
                            </a>
                          </p>
                        </div>
                      `
                    )
                    .join("")}
                </div>
              `,
            });

            if (error) {
              throw new Error(JSON.stringify(error));
            }

            return data;
          });
        }
      });
    }

    return { status: "completed" };
  }
);
