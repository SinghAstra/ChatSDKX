export const suggestionJsonSchema = {
  type: "array",
  description: "A list of exactly 4 chat prompt suggestions.",
  items: {
    type: "object",
    properties: {
      iconName: {
        type: "string",
        description:
          "A valid Lucide icon name (e.g., Code, Terminal, Sparkles, Database, Bug)",
      },
      title: {
        type: "string",
        description: "Short action phrase, max 4 words. No quotes.",
      },
      prompt: {
        type: "string",
        description: "The detailed prompt the user would send.",
      },
    },
    required: ["iconName", "title", "prompt"],
  },
};
