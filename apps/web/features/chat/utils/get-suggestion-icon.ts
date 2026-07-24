import {
  Bug,
  Code,
  Database,
  HelpCircle,
  LucideIcon,
  MessageSquare,
  Rocket,
  Sparkles,
  Terminal,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Terminal,
  Database,
  Sparkles,
  MessageSquare,
  Bug,
  Rocket,
  HelpCircle,
};

export function getSuggestionIcon(iconName: string): LucideIcon {
  const IconComponent = ICON_MAP[iconName];

  return IconComponent ?? Sparkles;
}
