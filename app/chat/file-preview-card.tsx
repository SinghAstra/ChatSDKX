import Copy from "@/components/markdown/copy";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Minimize2, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface FilePreviewCardProps {
  preview: string;
  index: number;
  setFilePreviews: React.Dispatch<React.SetStateAction<string[]>>;
}

const FilePreviewCard = ({
  preview,
  index,
  setFilePreviews,
}: FilePreviewCardProps) => {
  const [filePreviewForModal, setFilePreviewForModal] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowModal(false);
      }
    };

    if (showModal) {
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
  }, [showModal]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        key={index}
        className="group relative bg-background/50 border border-border rounded-lg p-2 w-48 hover:bg-background/20 transition-all duration-200 "
      >
        <div
          className="cursor-pointer"
          onClick={() => {
            setFilePreviewForModal(preview);
            setShowModal(true);
          }}
        >
          {preview
            .split("\n")
            .filter((line) => line.trim() !== "")
            .slice(0, 4)
            .map((line, lineIndex) => (
              <p
                key={lineIndex}
                className="text-xs text-muted-foreground truncate leading-relaxed"
              >
                {line}
              </p>
            ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-background/20 border border-border shadow-sm hover:bg-background/80 backdrop-blur-sm transition-all"
          onClick={() =>
            setFilePreviews((prev) => prev.filter((_, i) => i !== index))
          }
        >
          <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
        </Button>
      </motion.div>
      {showModal && (
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
              <span className="tracking-widest font-medium">Content</span>
              <div className="ml-auto flex gap-2">
                <div
                  className="border w-6 h-6 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-all duration-200"
                  onClick={() => setShowModal(false)}
                  title="Minimize"
                >
                  <Minimize2 className="w-3 h-3 text-muted-foreground" />
                </div>
                <Copy content={filePreviewForModal} />
              </div>
            </div>

            {/* Content with proper scrolling */}
            <div className="flex-1 overflow-auto p-4">
              <pre
                className="text-sm leading-relaxed min-h-full"
                style={{
                  whiteSpace: "pre",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {filePreviewForModal}
              </pre>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default FilePreviewCard;
