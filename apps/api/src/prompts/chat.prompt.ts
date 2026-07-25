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
You are an expert AI prompt engineer. Your task is to rewrite the user's prompt to be clearer, more specific, and highly effective for an LLM to answer.
If conversation history is provided, ensure the enhanced prompt logically follows the ongoing discussion context.
You MUST return a valid JSON object containing exactly one key: "enhancedPrompt".

Example format:
{
  "enhancedPrompt": "Explain the step-by-step process of how React hydration works, specifically addressing how it handles mismatches between server and client."
}
`;
