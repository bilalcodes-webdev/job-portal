import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AUTH_SECRET: z.string().min(1),
    AUTH_GOOGLE_ID: z.string().min(1),
    AUTH_GOOGLE_SECRET: z.string().min(1),
    AUTH_GITHUB_ID: z.string().min(1),
    AUTH_GITHUB_SECRET: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    ARCJET_KEY: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
  },
  client: {},

  experimental__runtimeEnv: {},
});
