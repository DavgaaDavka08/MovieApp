"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  title: string;
  trailerKey: string;
  variant?: "default" | "outline" | "secondary";
};

/** Трейлерийг цонхонд тоглуулах — shadcn Dialog */
export function TrailerDialog({ title, trailerKey, variant = "outline" }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant}>
          <Play /> Трейлер үзэх
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[min(960px,95vw)] gap-0 overflow-hidden border-0 bg-black p-0">
        <DialogTitle className="sr-only">{title} — трейлер</DialogTitle>
        <DialogDescription className="sr-only">YouTube трейлер</DialogDescription>
        <div className="aspect-video w-full">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
            title={`${title} трейлер`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
