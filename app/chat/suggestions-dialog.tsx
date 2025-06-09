"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, X } from "lucide-react";
import { useEffect, useRef } from "react";

interface SuggestionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: string[];
  className?: string;
}

export function SuggestionsDialog({
  isOpen,
  onClose,
  suggestions,
  className = "",
}: SuggestionsDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
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
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dialogRef}
          className={`absolute z-50 bg-background border border-border rounded-lg shadow-xl w-full max-w-md ${className}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
        >
          {/* Header */}
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
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="w-3 h-3" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Content */}
          <div className="p-3 max-h-[300px] overflow-y-auto">
            {suggestions.length > 0 ? (
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
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground text-xs">
                  No suggestions available
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
