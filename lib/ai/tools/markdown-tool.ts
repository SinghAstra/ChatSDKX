import { parseMdx } from "@/lib/markdown";
import { tool } from "ai";
import { z } from "zod";

export const markdownTool = tool({
  description:
    "Formats text into proper Markdown (headings, lists, bold, etc).",
  parameters: z.object({
    rawText: z.string(),
  }),
  execute: async ({ rawText }) => {
    const markdown = parseMdx(rawText);
    console.log("markdown is ", markdown);
    return markdown;
  },
});
