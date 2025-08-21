import { inngest } from "@/lib/inngest/client";
import {
  jobPeriodicNotification,
  JobPostExpiry,
} from "@/lib/inngest/functions/function";
import { serve } from "inngest/next";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [JobPostExpiry, jobPeriodicNotification],
});
