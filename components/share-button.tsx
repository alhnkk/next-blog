"use client";

import { Share2, Copy, Twitter, Facebook, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface ShareButtonProps {
  title: string;
}

export function ShareButton({ title }: ShareButtonProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Bağlantı kopyalandı!",
      description: "Blog yazısının bağlantısı panoya kopyalandı.",
    });
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(url, "_blank");
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(url, "_blank");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy className="mr-2 h-4 w-4" />
          Bağlantıyı Kopyala
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTwitterShare}>
          <Twitter className="mr-2 h-4 w-4" />
          Twitter&apos;da Paylaş
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFacebookShare}>
          <Facebook className="mr-2 h-4 w-4" />
          Facebook&apos;ta Paylaş
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLinkedInShare}>
          <Linkedin className="mr-2 h-4 w-4" />
          LinkedIn&apos;de Paylaş
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}