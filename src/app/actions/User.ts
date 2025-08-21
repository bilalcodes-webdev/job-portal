"use server";
import { ApiResponse } from "@/lib/Apiresponse";
import { checkUser } from "../data/user/require-user";
import { prisma } from "@/lib/prisma";
import { UserSchema, UserSchemaType } from "@/lib/zodSchema";
import { detectBot, fixedWindow, request } from "@arcjet/next";
import { aj } from "@/lib/arcjet";
import { inngest } from "@/lib/inngest/client";

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

export const createJobSeeker = async (
  values: UserSchemaType
): Promise<ApiResponse> => {
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
          message: "User exceeeds the limit, plase come back later",
        };
      }
    }

    const validate = UserSchema.safeParse(values);

    if (!validate.success) {
      return {
        status: "error",
        message: "Invalid values provded",
      };
    }

    await prisma.user.update({
      where: {
        id: session.user?.id,
      },
      data: {
        onBoardingComplete: true,
        userType: "JOB_SEEKER",
        JobSeeker: {
          create: {
            ...validate.data,
          },
        },
      },
    });

    await inngest.send({
      name: "jobseeker/created",
      data: {
        email: session.user?.email,
      },
    });

    return {
      status: "success",
      message: "Your requested completed successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to create user",
    };
  }
};
