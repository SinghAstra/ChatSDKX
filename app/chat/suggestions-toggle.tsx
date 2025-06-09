"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { HelpCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SuggestionsToggleProps {
  suggestions: string[];
}

export function SuggestionsToggle({ suggestions }: SuggestionsToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (!suggestions.length) return null;

  return (
    <>
      <div className={`flex justify-center relative mb-2`}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="h-7 px-2 text-xs bg-secondary/50 hover:bg-secondary gap-1.5 rounded-md"
          >
            <HelpCircle className="w-3 h-3" />
            <span>View Suggestions</span>
          </Button>
        </motion.div>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ">
            <motion.div
              ref={dialogRef}
              className={` bg-background border border-border rounded-lg shadow-xl w-full max-w-md `}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
            >
              <div className="flex items-center justify-between p-3 border-b border-border bg-secondary/50">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-medium">
                    Consider answering these questions
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0 hover:bg-muted"
                >
                  <X className="w-3 h-3" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <div className="p-3 max-h-[300px] overflow-y-auto">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground mb-2">
                    Including answers to these questions will help get better
                    responses:
                  </p>
                  <ul className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-2 text-xs leading-relaxed"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <span className="text-primary mt-0.5">•</span>
                        <span>{suggestion}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}
