"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Visibility } from "@prisma/client";
import {
  ChevronDownIcon,
  CircleCheck,
  GlobeIcon,
  LockIcon,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { saveChatVisibilityAsCookie } from "./action";

interface VisibilityObject {
  id: Visibility;
  label: string;
  description: string;
  icon: ReactNode;
}

const visibilities: VisibilityObject[] = [
  {
    id: "private",
    label: "Private",
    description: "Only you can access this chat",
    icon: <LockIcon />,
  },
  {
    id: "public",
    label: "Public",
    description: "Anyone with the link can access this chat",
    icon: <GlobeIcon />,
  },
];

interface VisibilitySelectorProps {
  chatVisibility: Visibility;
}

export function VisibilitySelector({
  chatVisibility,
}: VisibilitySelectorProps) {
  const [open, setOpen] = useState(false);
  const [visibilityType, setVisibilityType] =
    useState<Visibility>(chatVisibility);
  const selectedVisibility = visibilities.find(
    (visibility) => visibility.id === visibilityType
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          "w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
        )}
      >
        <Button
          variant="outline"
          className="hidden md:flex md:px-2 md:h-[34px]"
        >
          {selectedVisibility?.icon}
          {selectedVisibility?.label}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-[300px]">
        {visibilities.map((visibility) => (
          <DropdownMenuItem
            key={visibility.id}
            onSelect={() => {
              setOpen(false);
              setVisibilityType(visibility.id);
              saveChatVisibilityAsCookie(visibility.id);
            }}
            className="gap-4 group/item flex flex-row justify-between items-center"
            data-active={visibility.id === visibilityType}
          >
            <div className="flex flex-col gap-1 items-start">
              {visibility.label}
              {visibility.description && (
                <div className="text-xs text-muted-foreground">
                  {visibility.description}
                </div>
              )}
            </div>
            <div className="text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
              <CircleCheck />
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
