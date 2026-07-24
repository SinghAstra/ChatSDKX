import { AlertCircle, Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import { MarkdownRenderer } from "./markdown-renderer";
import { TextShine } from "@/components/component-x/text-shine";

interface AiMessageProps {
  content: string;
  isError?: boolean;
  onRetry?: () => void;
}

export function AiMessage({ content, isError, onRetry }: AiMessageProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);

    setIsCopied(true);

    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex w-full justify-start group">
      <div className="flex flex-col w-full max-w-[95%]">
        {/* Error UI */}
        {isError ? (
          <div className="flex items-center gap-2 py-2 text-destructive text-sm font-medium">
            <AlertCircle className="size-4 shrink-0" />
            <span>Something went wrong while generating the response.</span>
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center cursor-pointer gap-1 ml-2 text-xs font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                <RefreshCw className="size-3" />
                Retry
              </button>
            )}
          </div>
        ) : (
          <div className="w-full py-2">
            {content === "" ? (
              <div className="text-[15px] py-1">
                <TextShine>Thinking...</TextShine>
              </div>
            ) : (
              <MarkdownRenderer content={content} />
            )}
          </div>
        )}

        {/* Action Bar */}
        {!isError && content !== "" && (
          <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center size-8 rounded-md bg-muted/50 cursor-pointer
               hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
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
