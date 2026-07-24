import { Check, Copy } from "lucide-react";
import { useState } from "react";

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
      <div className="flex flex-col w-full">
        <div className="text-[15px] leading-relaxed bg-transparent text-foreground w-full py-2">
          {content}
        </div>

        <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center size-8 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Copy message"
          >
            {isCopied ? (
              <Check className="size-4 text-green-500" />
            ) : (
              <Copy className="size-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
