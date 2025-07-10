"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Pause, Play, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ReasoningToastProps {
  reasoning: string;
}

export default function ReasoningToast({ reasoning }: ReasoningToastProps) {
  const autoHideDuration = 8000;
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!autoHideDuration || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (autoHideDuration / 100);
        if (newProgress <= 0) {
          handleDismiss();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [autoHideDuration, isPaused]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <AnimatePresence>
      {isVisible && (
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
            {autoHideDuration > 0 && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-secondary/30">
                <motion.div
                  className={`h-full transition-all duration-100`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <div className="p-4">
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`
                  flex-shrink-0 rounded-full p-1.5
                 border 
                `}
                >
                  <Sparkles className={`h-3 w-3 `} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm truncate">
                    Reasoning behind Prompt Improvement
                  </h3>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Pause/Play button */}
                  {autoHideDuration > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={togglePause}
                      className="h-6 w-6 p-0 hover:bg-secondary/50"
                    >
                      {isPaused ? (
                        <Play className="h-3 w-3" />
                      ) : (
                        <Pause className="h-3 w-3" />
                      )}
                      <span className="sr-only">
                        {isPaused ? "Resume" : "Pause"}
                      </span>
                    </Button>
                  )}

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
                {autoHideDuration > 0 && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground/70">
                    <div className="flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      <span>
                        {isPaused
                          ? "Paused"
                          : `${Math.ceil(
                              ((progress / 100) * autoHideDuration) / 1000
                            )}s`}
                      </span>
                    </div>
                    <span>Hover to pause</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
