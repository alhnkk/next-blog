import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "ghost";
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("text-center py-12", className)}>
      {Icon && (
        <Icon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      )}
      <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
        {title}
      </h4>
      {description && (
        <p className="text-gray-500 dark:text-gray-500 mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button 
          variant={action.variant || "outline"} 
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Küçük empty state (sidebar, list için)
interface EmptyStateSmallProps {
  icon?: LucideIcon;
  message: string;
  className?: string;
}

export function EmptyStateSmall({
  icon: Icon,
  message,
  className
}: EmptyStateSmallProps) {
  return (
    <div className={cn("text-center py-8", className)}>
      {Icon && (
        <Icon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
      )}
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}
