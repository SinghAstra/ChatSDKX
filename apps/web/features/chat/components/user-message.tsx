import { Check, ChevronDown, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  const [isCopied, setIsCopied] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);

  const [isExpandable, setIsExpandable] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setIsExpandable(
        textRef.current.scrollHeight > textRef.current.clientHeight
      );
    }
  }, [content]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);

    setIsCopied(true);

    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex w-full justify-end group">
      <div className="flex flex-col items-end max-w-[85%] md:max-w-[75%]">
        <div className="relative text-[15px] leading-relaxed bg-muted/30 text-muted-foreground px-5 py-3.5 rounded-3xl transition-all duration-300 w-full">
          <div
            ref={textRef}
            className={`whitespace-pre-wrap wrap-break-word transition-all duration-300 ${
              isExpanded ? "animate-in fade-in pb-6" : "line-clamp-4"
            }`}
          >
            {content}
          </div>

          {isExpandable && (
            <div className="absolute bottom-2 right-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-center size-7 rounded-full bg-background/60 hover:bg-background border border-border/40 backdrop-blur-sm text-foreground transition-all shadow-sm focus:outline-none"
                aria-label={isExpanded ? "Show less" : "Show more"}
              >
                <ChevronDown
                  className={`size-3.5 transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 mt-1.5 mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center size-8 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
            title="Copy message"
          >
            {isCopied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
