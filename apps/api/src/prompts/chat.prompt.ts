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
