import { z } from "zod";

export const chatBaseSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ChatBase = z.infer<typeof chatBaseSchema>;
