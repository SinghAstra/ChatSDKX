import { ChatReasoning } from "@/interfaces/ai";

export const chatReasoning: ChatReasoning[] = [
  {
    id: "regular-model",
    name: "Regular model",
    description: "Primary model for all-purpose chat",
  },
  {
    id: "reasoning-model",
    name: "Reasoning model",
    description: "Uses advanced reasoning",
  },
];

export const DEFAULT_CHAT_REASONING: string = chatReasoning[0].id;
