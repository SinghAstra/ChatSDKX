"use client";

import { Typography } from "@/components/ui/typography";
import { Markdown } from "@/lib/markdown";
import { ClientMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";

interface MessageContentProps {
  message: ClientMessage;
}

export function MessageContent({ message }: MessageContentProps) {
  const isLargeText = message.content.length > 600;

  if (!isLargeText || message.role === Role.model) {
    return (
      <div className="px-3 py-1">
        <Typography>
          <Markdown>{message.content}</Markdown>
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 ">
      <div>
        <div
          className={cn(
            "max-h-[300px] overflow-y-auto transition-all duration-200 px-3 py-1"
          )}
        >
          <Typography>
            <Markdown>{message.content}</Markdown>
          </Typography>
        </div>
      </div>
    </div>
  );
}
