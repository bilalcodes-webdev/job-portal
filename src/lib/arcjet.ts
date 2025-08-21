import arcjet, {
  detectBot,
  tokenBucket,
  fixedWindow,
  slidingWindow,
  shield,
} from "@arcjet/next";
import { env } from "./env";

export { detectBot, tokenBucket, fixedWindow, slidingWindow };

export const aj = arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["fingerprint"],
  rules: [shield({ mode: "LIVE" })],
});
