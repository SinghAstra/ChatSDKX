"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

export default function Copy({ content }: { content: string }) {
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

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
