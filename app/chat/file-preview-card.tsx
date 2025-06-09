import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import React, { useState } from "react";

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
      {/* File Preview Modal - Using theme colors */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0 bg-card border-border">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold text-foreground">
              File Preview
            </h2>
          </div>
          <div className="overflow-auto p-6">
            <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
              {filePreviewForModal}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FilePreviewCard;
