"use client";

import { useState } from "react";
import { SearchIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBox } from "./SearchBox";

/** Гар утсанд хайлтын товч дарахад header бүхэлдээ хайлтын мөр болно */
export function MobileSearch({ genreMenu }: { genreMenu: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <Button variant="outline" size="icon" aria-label="Хайх" onClick={() => setOpen(true)}>
        <SearchIcon />
      </Button>
    );
  }
  return (
    <div className="absolute inset-0 z-10 flex items-center gap-3 bg-background px-5">
      {genreMenu}
      <SearchBox className="flex-1" autoFocus onNavigate={() => setOpen(false)} />
      <Button variant="ghost" size="icon" aria-label="Хаах" onClick={() => setOpen(false)}>
        <X />
      </Button>
    </div>
  );
}
