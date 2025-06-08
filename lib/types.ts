import { Role } from "@prisma/client";

export type ClientMessage = {
  id: string;
  role: Role;
  content: string;
  isStreaming?: boolean;
};
