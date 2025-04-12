export const chatModelNames = [
  "gemini-2.5-pro-experimental",
  "gemini-2.0-flash",
  "gemini-2.0-flash-experimental",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-thinking-experimental-01-21",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro",
] as const;

export type ChatModel = (typeof chatModelNames)[number];
