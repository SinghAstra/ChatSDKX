import { Groq } from "groq-sdk";
import { validateApiEnv } from "@repo/env";

const env = validateApiEnv();

export const groqClient = new Groq({
  apiKey: env.GROQ_API_KEY,
});
