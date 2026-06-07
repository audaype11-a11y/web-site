"use client";

import { Share2, Twitter, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // fallback
    }
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch {
        // user cancelled
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground flex items-center gap-1">
        <Share2 className="h-4 w-4" />
        مشاركة:
      </span>
      <Button variant="outline" size="sm" onClick={shareTwitter}>
        <Twitter className="h-4 w-4 ml-1" />
        تويتر
      </Button>
      <Button variant="outline" size="sm" onClick={copyLink}>
        <LinkIcon className="h-4 w-4 ml-1" />
        نسخ الرابط
      </Button>
      {typeof navigator !== "undefined" && navigator.share && (
        <Button variant="outline" size="sm" onClick={shareNative}>
          <Share2 className="h-4 w-4 ml-1" />
          مشاركة
        </Button>
      )}
    </div>
  );
}
