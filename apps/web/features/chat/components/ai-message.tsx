import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { MarkdownRenderer } from "./markdown-renderer";
import { TextShine } from "@/components/component-x/text-shine";

interface AiMessageProps {
  content: string;
}

export function AiMessage({ content }: AiMessageProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);

    setIsCopied(true);

    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex w-full justify-start group">
      <div className="flex flex-col w-full max-w-[95%]">
        <div className="w-full py-2">
          {/* Show Thinking Animation if content is empty */}
          {content === "" ? (
            <div className="text-[15px] py-1">
              <TextShine>Thinking...</TextShine>
            </div>
          ) : (
            <MarkdownRenderer content={content} />
          )}
        </div>

        {/* Action Bar (Hide completely if still thinking) */}
        {content !== "" && (
          <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center size-8 rounded-md bg-muted/50 hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors focus:outline-none cursor-pointer"
              title="Copy message"
            >
              {isCopied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
