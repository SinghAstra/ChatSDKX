"use client";

import { motion } from "framer-motion";
import { Maximize2, Minimize2 } from "lucide-react";
import { ComponentProps, useEffect, useRef, useState } from "react";
import Copy from "./copy";

export default function Pre({
  children,
  raw,
  filename,
  ...rest
}: ComponentProps<"pre"> & {
  raw?: string;
  filename?: string;
}) {
  const [showMaximize, setShowMaximize] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setShowMaximize(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowMaximize(false);
      }
    };

    if (showMaximize) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showMaximize]);

  return (
    <>
      <div className=" relative rounded  w-full border mx-auto ">
        <div className="text-sm bg-muted/30 px-3 py-1 border-b  rounded-t flex items-center justify-between">
          <span className="tracking-widest ">{filename}</span>
          <div className="ml-auto flex gap-2">
            <div
              className="border w-6 h-6 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-all duration-200"
              onClick={() => setShowMaximize(true)}
            >
              <Maximize2 className="w-3 h-3 text-muted-foreground" />
            </div>
            <Copy content={raw!} fileName={filename} />
          </div>
        </div>
        <div className="overflow-x-auto p-2 ">
          <pre {...rest}>{children}</pre>
        </div>
      </div>
      {showMaximize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            className="bg-background rounded-xl border min-w-[60vw] w-fit max-w-[95vw] max-h-[90vh] flex flex-col shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            ref={divRef}
          >
            {/* Header */}
            <div className="text-sm bg-muted/30 px-3 py-2 border-b rounded-t-xl flex items-center justify-between flex-shrink-0">
              <span className="tracking-widest font-medium">{filename}</span>
              <div className="ml-auto flex gap-2">
                <div
                  className="border w-6 h-6 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-all duration-200"
                  onClick={() => setShowMaximize(false)}
                  title="Minimize"
                >
                  <Minimize2 className="w-3 h-3 text-muted-foreground" />
                </div>
                <Copy content={raw!} fileName={filename} />
              </div>
            </div>

            {/* Content with proper scrolling */}
            <div className="flex-1 overflow-auto p-4">
              <pre
                {...rest}
                className="text-sm leading-relaxed min-h-full"
                style={{
                  whiteSpace: "pre",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {children}
              </pre>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
