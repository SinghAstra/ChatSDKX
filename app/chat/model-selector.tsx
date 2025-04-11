"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { chatModels } from "@/lib/ai/models";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, CircleCheck } from "lucide-react";
import { saveChatModelAsCookie } from "./action";

interface ModelSelectorProps {
  initialChatModelId: string;
}

export function ModelSelector({ initialChatModelId }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState(initialChatModelId);

  const selectedChatModel = chatModels.find(
    (chatModel) => chatModel.id === selectedModelId
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          "w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
        )}
      >
        <Button variant="outline" className="md:px-2 md:h-[34px]">
          {selectedChatModel?.name}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[300px]">
        {chatModels.map((chatModel) => {
          const { id } = chatModel;

          return (
            <DropdownMenuItem
              data-testid={`model-selector-item-${id}`}
              key={id}
              onSelect={() => {
                setOpen(false);
                setSelectedModelId(id);
                saveChatModelAsCookie(id);
              }}
              data-active={id === selectedModelId}
              asChild
            >
              <button
                type="button"
                className="gap-4 group/item flex flex-row justify-between items-center w-full"
              >
                <div className="flex flex-col gap-1 items-start">
                  <div>{chatModel.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {chatModel.description}
                  </div>
                </div>

                <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
                  <CircleCheck />
                </div>
              </button>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
