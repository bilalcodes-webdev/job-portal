"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const checkUser = async () => {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  return session;
};

export const checkOnBoardingStatus = async (userId: string) => {
  const status = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      onBoardingComplete: true,
    },
  });

  if (status?.onBoardingComplete === true) {
    return redirect("/");
  }

  return status;
};

export const getUserType = async () => {
  const session = await auth();

  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: {
      id: session.user?.id as string,
    },
    select: {
      userType: true,
    },
  });

  return user?.userType === "COMPANY" ? true : false;
};
