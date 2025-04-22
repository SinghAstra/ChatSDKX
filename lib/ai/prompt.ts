export const regularPrompt =
  "You are a friendly assistant! Keep your responses concise and helpful.";

export const systemPrompt = ({
  selectedChatModel,
}: {
  selectedChatModel: string;
}) => {
  if (selectedChatModel === "reasoning-model") {
    return regularPrompt;
  } else {
    return `${regularPrompt}\n\n`;
  }
};
