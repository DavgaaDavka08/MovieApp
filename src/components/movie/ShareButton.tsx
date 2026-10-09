"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Киноны давтагдашгүй линкийг хуваалцах / хуулах */
export function ShareButton({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const url = `${window.location.origin}${path}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* хэрэглэгч цуцалсан */
    }
  };

  return (
    <Button variant="outline" onClick={onShare}>
      {copied ? <Check /> : <Share2 />}
      {copied ? "Линк хуулагдлаа" : "Хуваалцах"}
    </Button>
  );
}
