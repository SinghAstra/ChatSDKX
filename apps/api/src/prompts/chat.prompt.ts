export const DYNAMIC_SUGGESTIONS_PROMPT = `
Generate 4 diverse, helpful prompt suggestions for a full-stack developer chat application.
You MUST return a JSON object with a single root key "suggestions" containing an array of 4 objects.
Each object must have these exact keys: "iconName" (string, e.g. "Code", "Terminal", "Database", "MessageSquare"), "title" (string), and "prompt" (string).

Example format:
{
  "suggestions": [
    {
      "iconName": "Code",
      "title": "Review this code",
      "prompt": "Can you help me optimize this React component?"
    }
  ]
}
`;

export const buildTitleGenerationPrompt = (firstMessage: string) => `
Generate a short, descriptive title (maximum 4 to 5 words) for a chat that starts with the following message.

CRITICAL RULES:
- NEVER wrap the generated title in quotation marks.
- Apostrophes are completely fine to use (e.g., User's Guide, Developer's Tool).
- Return ONLY the title string, nothing else.

Message: "${firstMessage}"
`;

export const ENHANCE_PROMPT_INSTRUCTION = `
You are an expert AI prompt engineer. Your task is to analyze the user's prompt and determine if it can be enhanced, or if it is too vague and requires more information.
If conversation history is provided, use it for context.

You MUST return a valid JSON object matching exactly ONE of these two formats:

Format 1 (If you can improve it):
{
  "status": "improved",
  "enhancedPrompt": "The fully rewritten, detailed prompt...",
  "rationale": "Briefly explain why this is better (e.g., 'Added specificity about the framework and desired output format.')."
}

Format 2 (If the prompt is completely vague, lacking crucial context, or ambiguous):
{
  "status": "needs_info",
  "questions": ["What specific programming language are you using?", "Are there any error codes?"]
}
`;
