"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { SuggestionsDialog } from "./suggestions-dialog";

interface SuggestionsToggleProps {
  suggestions: string[];
}

export function SuggestionsToggle({ suggestions }: SuggestionsToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

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
          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2">
            <SuggestionsDialog
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              suggestions={suggestions}
            />
          </div>
        )}
      </div>
    </>
  );
}
