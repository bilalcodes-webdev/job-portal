import { Inngest } from "inngest";

// Server-side Inngest client
export const inngest = new Inngest({
  id: "job-bilal",
  apiKey: process.env.INNGEST_EVENT_KEY, // <-- yaha event key use hoti hai
});
