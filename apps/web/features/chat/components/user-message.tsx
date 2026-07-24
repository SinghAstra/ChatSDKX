import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, Copy } from "lucide-react";
import { useState } from "react";

interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);

    setIsCopied(true);

    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex w-full justify-end group">
      <div className="relative text-[15px] leading-relaxed bg-muted/30 text-muted-foreground px-5 py-3.5 pb-8 rounded-3xl max-w-[85%] md:max-w-[75%]">
        <div className="whitespace-pre-wrap">{content}</div>

        <div className="absolute bottom-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center size-6 rounded-full bg-background/50 hover:bg-background border border-border/50 text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1">
                <ChevronDown className="size-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                onClick={handleCopy}
                className="cursor-pointer gap-2"
              >
                {isCopied ? (
                  <Check className="size-3.5 text-green-500" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                <span>{isCopied ? "Copied" : "Copy"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
