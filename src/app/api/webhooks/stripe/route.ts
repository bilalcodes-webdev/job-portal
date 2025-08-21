import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const headerList = await headers();
  const stripeHeaders = headerList.get("Stripe-Signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      stripeHeaders as string,
      process.env.WEBHOOK_SECRET as string
    );
  } catch (error) {
    return new Response("Webhook Error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const stripeCustomerId = session.customer;
    const jobId = session.metadata?.jobId;
    const expirationDate = session.metadata?.expirationDate;

    if (!jobId) {
      return new Response("Job id not found", { status: 400 });
    }

    const company = await prisma.user.findUnique({
      where: {
        stripeCustomerId: stripeCustomerId as string,
      },
      select: {
        Company: { select: { id: true } },
      },
    });

    if (!company) {
      return new Response("company not found", { status: 400 });
    }

    const job = await prisma.jobPost.update({
      where: {
        id: jobId,
        companyId: company.Company?.id as string,
      },
      data: {
        status: "ACTIVE",
      },
    });

    // 👉 Trigger Inngest only after successful payment
    await inngest.send({
      name: "postjob/created",
      data: {
        postId: jobId,
        expirationDate, // this came from metadata
      },
    });
  }

  return new Response(null, { status: 200 });
}
