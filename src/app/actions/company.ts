"use server";
import { fixedWindow, request } from "@arcjet/next";

import { prisma } from "@/lib/prisma";
import { checkUser } from "../data/user/require-user";
import { companySchema, CompanySchemaType } from "@/lib/zodSchema";
import { ApiResponse } from "@/lib/Apiresponse";
import { aj, detectBot } from "@/lib/arcjet";

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

export const createCompany = async (
  data: CompanySchemaType
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

    const validate = companySchema.safeParse(data);

    if (!validate.success) {
      return {
        status: "error",
        message: "Invalid valus given",
      };
    }

    await prisma.user.update({
      where: {
        id: session.user?.id,
      },
      data: {
        onBoardingComplete: true,
        userType: "COMPANY",
        Company: {
          create: {
            ...validate.data,
          },
        },
      },
    });

    return {
      status: "success",
      message: "Company created successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to create company, try again",
    };
  }
};
