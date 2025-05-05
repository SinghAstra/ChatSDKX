"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CopyProps {
  content: string;
  fileName?: string;
}

export default function Copy({ content, fileName }: CopyProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setIsCopied(true);

    if (fileName) {
      setMessage(`Copied ${fileName}`);
    }

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  useEffect(() => {
    if (!message) return;
    toast(message);
    setMessage(null);
  }, [message]);

  return (
    <div
      className="border w-6 h-6 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-all duration-200"
      onClick={handleCopy}
    >
      {isCopied ? (
        <CheckIcon className="w-3 h-3" />
      ) : (
        <CopyIcon className="w-3 h-3" />
      )}
    </div>
  );
}
