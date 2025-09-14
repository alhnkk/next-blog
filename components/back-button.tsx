"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function BackButton({ 
  className = "w-full sm:w-auto",
  size = "lg",
  variant = "outline"
}: BackButtonProps) {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <Button 
      variant={variant}
      size={size}
      className={className}
      onClick={handleBack}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Geri Dön
    </Button>
  );
}

// Default export da ekleyelim
export default BackButton;