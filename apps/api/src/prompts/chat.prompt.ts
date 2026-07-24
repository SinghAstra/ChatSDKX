export const DYNAMIC_SUGGESTIONS_PROMPT = `
You are a helpful AI assistant for a developer-focused chat application.
Generate exactly 4 highly relevant, diverse chat prompt suggestions to help a developer get started. 
Focus on common engineering tasks: debugging, architecture, code review, and explaining concepts.

CRITICAL RULES:
1. "title" must be a short action phrase (maximum 4 words).
2. DO NOT use quotation marks in the title. Apostrophes are fine.
3. "iconName" must be a valid Lucide icon name related to the task.

EXAMPLE OUTPUT:
[
  {
    "iconName": "Code",
    "title": "Review this code",
    "prompt": "Can you help me optimize this React component for better re-render performance?"
  },
  {
    "iconName": "Terminal",
    "title": "Debug an error",
    "prompt": "I am getting a hydration mismatch error in my Next.js 15 application."
  },
  {
    "iconName": "Database",
    "title": "Design a schema",
    "prompt": "What are the best practices for structuring a PostgreSQL database for a real-time chat app?"
  },
  {
    "iconName": "Sparkles",
    "title": "Brainstorm ideas",
    "prompt": "What are some modern authentication strategies for a monorepo setup?"
  }
]
`;

export const buildTitleGenerationPrompt = (firstMessage: string) => `
Generate a short, descriptive title (maximum 4 to 5 words) for a chat that starts with the following message.

CRITICAL RULES:
- NEVER wrap the generated title in quotation marks.
- Apostrophes are completely fine to use (e.g., User's Guide, Developer's Tool).
- Return ONLY the title string, nothing else.

Message: "${firstMessage}"
`;
