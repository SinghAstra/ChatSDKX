"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ReasoningToastProps {
  reasoning: string | null;
}

export default function ReasoningToast({ reasoning }: ReasoningToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const progressReComputeTimeIntervalInMilliSeconds = 100;

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 1;
        if (newProgress <= 0) {
          handleDismiss();
          return 0;
        }
        return newProgress;
      });
    }, progressReComputeTimeIntervalInMilliSeconds);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  useEffect(() => {
    setIsVisible(true);
    setProgress(100);
    setIsExpanded(false);
    setIsPaused(false);
  }, [reasoning]);

  if (!reasoning || !isVisible) {
    return;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`fixed top-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`
            relative overflow-hidden rounded-lg border backdrop-blur-sm
            shadow-lg hover:shadow-xl transition-all duration-300
            bg-card/95
          `}
        >
          {/* Progress bar */}
          {progress > 0 && (
            <div className="absolute top-0 left-0 right-0 h-1">
              <motion.div
                className={`h-full transition-all duration-300 bg-primary`}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <div className="p-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className={`h-3 w-3 `} />

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground text-sm truncate">
                  Reasoning behind Prompt Improvement
                </h3>
              </div>

              {/* Dismiss button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-6 w-6 p-0 hover:bg-secondary/50"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Dismiss</span>
              </Button>
            </div>

            {/* Content */}
            <div className="space-y-3">
              {isExpanded ? (
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {reasoning}
                </p>
              ) : (
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                  {reasoning}
                </p>
              )}

              {/* Expand/Collapse for long content */}
              {reasoning.length > 150 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}

              {/* Status indicator */}
              {progress > 0 && (
                <div className="flex items-center justify-between text-xs text-muted-foreground/70">
                  <div className="flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    <span>
                      {isPaused
                        ? "Paused"
                        : `${Math.ceil(
                            progress *
                              (progressReComputeTimeIntervalInMilliSeconds /
                                1000)
                          )} s`}
                    </span>
                  </div>
                  <span>Hover to pause</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
