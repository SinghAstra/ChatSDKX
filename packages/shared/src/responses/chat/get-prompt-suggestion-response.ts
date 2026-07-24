import { z } from "zod";

export const promptSuggestionSchema = z.object({
  iconName: z.string(),
  title: z.string(),
  prompt: z.string(),
});

export const getPromptSuggestionsResponseSchema = z.array(
  promptSuggestionSchema
);

export type PromptSuggestion = z.infer<typeof promptSuggestionSchema>;

export type GetPromptSuggestionsResponse = z.infer<
  typeof getPromptSuggestionsResponseSchema
>;
