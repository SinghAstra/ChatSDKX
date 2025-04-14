import { parseMdx } from "@/lib/markdown";
import { tool } from "ai";
import { z } from "zod";

export const markdownTool = tool({
  description: "This markdown tool takes markdown string as input parse",
  parameters: z.object({
    rawText: z.string(),
  }),
  execute: async ({ rawText }) => {
    const markdown = await parseMdx(rawText);
    console.log("markdown is ", markdown);
    return markdown;
  },
});
