import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Loader2, Send, Sparkles, Undo2 } from "lucide-react";
import React from "react";
import FilePreviewCard from "./file-preview-card";

interface ChatInputProps {
  filePreviews: string[];
  setFilePreviews: React.Dispatch<React.SetStateAction<string[]>>;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  input: string;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => Promise<void>;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handlePaste: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  isImprovingPrompt: boolean;
  originalPrompt: string | null;
  handleUndoImprove: () => void;
  isStreaming: boolean;
  handleImprovePrompt: () => Promise<void>;
  handleInputSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmittingInput: boolean;
}

const ChatInput = ({
  filePreviews,
  setFilePreviews,
  inputRef,
  input,
  handleKeyDown,
  handleInputChange,
  handlePaste,
  isImprovingPrompt,
  originalPrompt,
  handleUndoImprove,
  isStreaming,
  handleImprovePrompt,
  handleInputSubmit,
  isSubmittingInput,
}: ChatInputProps) => {
  return (
    <div className="w-full max-w-3xl border rounded mx-auto bg-background">
      <div className="relative">
        {/* File Previews */}
        {filePreviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-muted/30"
          >
            <div className="flex gap-3 overflow-x-auto p-2  ">
              {filePreviews.map((preview, index) => (
                <FilePreviewCard
                  key={index}
                  preview={preview}
                  index={index}
                  setFilePreviews={setFilePreviews}
                />
              ))}
            </div>
          </motion.div>
        )}

        <Textarea
          ref={inputRef}
          value={input}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          onPaste={handlePaste}
          placeholder="Type your message here..."
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[120px] p-3  placeholder:text-muted-foreground bg-transparent"
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end px-4 py-2 gap-2 ">
          {isImprovingPrompt ? (
            <Button
              variant="outline"
              disabled
              className="gap-2 text-sm rounded"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              Enhancing...
            </Button>
          ) : originalPrompt ? (
            <Button
              variant="outline"
              onClick={handleUndoImprove}
              className="gap-2 text-sm rounded hover:bg-muted/20"
            >
              <Undo2 className="w-4 h-4" />
              Undo Enhancement
            </Button>
          ) : (
            <Button
              variant="outline"
              disabled={!input.trim() || isSubmittingInput}
              onClick={handleImprovePrompt}
              className="gap-2 text-sm rounded hover:bg-muted/20"
            >
              <Sparkles className="w-4 h-4" />
              Enhance Prompt
            </Button>
          )}

          <Button
            disabled={
              !input.trim() ||
              isStreaming ||
              isImprovingPrompt ||
              isSubmittingInput
            }
            onClick={handleInputSubmit}
            className="bg-primary hover:bg-primary/90 px-6 disabled:opacity-50 rounded"
          >
            {isSubmittingInput ? (
              <div className="flex gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Wait....
              </div>
            ) : (
              <div className="flex gap-2">
                <Send className="h-4 w-4" />
                Send
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
