"use server";

import { listingPlans } from "@/lib/jobListingPrice";
import { ApiResponse } from "@/lib/Apiresponse";
import { JobPostSchema, JobPostSchemaType } from "@/lib/zodSchema";
import { checkUser } from "../data/user/require-user";
import { aj, detectBot, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { inngest } from "@/lib/inngest/client";
import { revalidatePath } from "next/cache";

const arcjet = aj
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );

export const createJobPost = async (
  values: JobPostSchemaType
): Promise<ApiResponse | never> => {
  const session = await checkUser();
  const req = await request();

  const decision = await arcjet.protect(req, {
    fingerprint: session.user?.id as string,
  });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return {
        status: "error",
        message: "User exceeded the posting limit, please try again later",
      };
    }
  }

  const validate = JobPostSchema.safeParse(values);

  if (!validate.success) {
    return {
      status: "error",
      message: "Invalid values provided",
    };
  }

  const company = await prisma.company.findUnique({
    where: {
      userId: session.user?.id,
    },
    select: {
      id: true,
      user: {
        select: {
          stripeCustomerId: true,
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!company?.id) {
    return redirect("/");
  }

  let stripeCustomerId = company.user.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      name: company.user.name ?? "Unknown",
      email: company.user.email ?? undefined,
    });

    stripeCustomerId = customer.id;

    await prisma.user.update({
      where: {
        id: company.user.id,
      },
      data: {
        stripeCustomerId,
      },
    });
  }

  const post = await prisma.jobPost.create({
    data: {
      employmentType: validate.data.employmentType,
      jobDescription: validate.data.jobDescription,
      jobTitle: validate.data.jobTitle,
      listingDuration: validate.data.listingDuration,
      location: validate.data.location,
      salaryFrom: validate.data.salaryFrom,
      salaryTo: validate.data.salaryTo,
      benefits: validate.data.benefits,
      companyId: company.id,
    },
    select: {
      id: true,
    },
  });

  const priceTier = listingPlans.find(
    (price) => price.days === validate.data.listingDuration
  );

  if (!priceTier) {
    return {
      status: "error",
      message: "Invalid price tier selected",
    };
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [
      {
        price_data: {
          currency: "USD",
          unit_amount: priceTier.price * 100,
          product_data: {
            name: `Job Posting ${priceTier.days} Days`,
            description: priceTier.description,
            images: [
              "https://s9ex5ktwsx.ufs.sh/f/eJGlnZXEUxYXkXAaC8BvfSXm5bO1FG4NsyL72ATi0wIn9VKC",
            ],
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      jobId: post.id as string,
      expirationDate: validate.data.listingDuration,
    },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
  });

  return redirect(checkoutSession.url as string);
};

export const savedJob = async (postId: string): Promise<ApiResponse> => {
  const session = await checkUser();
  try {
    const req = await request();

    const decision = await arcjet.protect(req, {
      fingerprint: session.user?.id as string,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "User exceeded the posting limit, please try again later",
        };
      }
    }

    await prisma.saveJobPost.create({
      data: {
        jobPostId: postId,
        userId: session.user?.id as string,
      },
    });

    revalidatePath(`/job/${postId}`);
    return {
      status: "success",
      message: "Saved job successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to save a job",
    };
  }
};
export const unsavedJob = async (postId: string): Promise<ApiResponse> => {
  const session = await checkUser();
  try {
    const req = await request();

    const decision = await arcjet.protect(req, {
      fingerprint: session.user?.id as string,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "User exceeded the posting limit, please try again later",
        };
      }
    }

    await prisma.saveJobPost.delete({
      where: {
        id: postId,
        userId: session.user?.id as string,
      },
    });

    revalidatePath(`/job/${postId}`);

    return {
      status: "success",
      message: "Unsaved Job Successfull",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to unsave a job",
    };
  }
};

export const editJobPost = async (
  values: JobPostSchemaType,
  postId: string
): Promise<ApiResponse | never> => {
  const session = await checkUser();
  try {
    const req = await request();

    const decision = await arcjet.protect(req, {
      fingerprint: session.user?.id as string,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "User exceeded the posting limit, please try again later",
        };
      }
    }

    const validate = JobPostSchema.safeParse(values);

    if (!validate.success) {
      return {
        status: "error",
        message: "Invalid values provided",
      };
    }

    await prisma.jobPost.update({
      where: {
        id: postId,
        Company: {
          userId: session.user?.id,
        },
      },
      data: {
        employmentType: validate.data.employmentType,
        jobDescription: validate.data.jobDescription,
        jobTitle: validate.data.jobTitle,
        listingDuration: validate.data.listingDuration,
        location: validate.data.location,
        salaryFrom: validate.data.salaryFrom,
        salaryTo: validate.data.salaryTo,
        benefits: validate.data.benefits,
      },
    });

    return {
      status: "success",
      message: "Job post updated successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to update job post",
    };
  }
};

export const deletePost = async (postId: string): Promise<ApiResponse> => {
  const session = await checkUser();

  try {
    const req = await request();

    const decision = await arcjet.protect(req, {
      fingerprint: session.user?.id as string,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "User exceeded the posting limit, please try again later",
        };
      }
    }

    await prisma.jobPost.delete({
      where: {
        id: postId,
        Company: {
          userId: session.user?.id,
        },
      },
    });

    return {
      status: "success",
      message: "Job post deleted successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to delete a job post",
    };
  }
};
