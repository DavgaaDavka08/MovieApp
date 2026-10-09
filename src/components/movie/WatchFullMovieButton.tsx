"use client";

import { Lock, QrCode, Smartphone, PlayCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/types/movie";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  movie: Pick<Movie, "title" | "price">;
  className?: string;
  size?: "default" | "lg";
};

/**
 * "Бүтэн киног үзэх" товч.
 * Phase 1: төлбөр, нэвтрэлт хараахан холбогдоогүй тул хэрэглэгчид
 * дараагийн алхмуудыг үнэн зөв тайлбарлана. Хуурамч төлбөр үүсгэхгүй.
 */
export function WatchFullMovieButton({ movie, className, size = "lg" }: Props) {
  const steps = [
    { icon: Smartphone, text: "Утасны дугаар, нууц үгээр нэвтрэх" },
    { icon: QrCode, text: "QPay / банкны аппаар QR уншуулж төлөх" },
    { icon: PlayCircle, text: "Төлбөр баталгаажмагц бүтэн кино шууд нээгдэнэ" },
  ];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={size}
          className={cn(
            "gap-2 bg-primary font-semibold text-primary-foreground hover:bg-primary/90",
            className
          )}
        >
          <PlayCircle className="h-5 w-5" />
          Бүтэн киног үзэх — {formatPrice(movie.price)}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-left">{movie.title}</DialogTitle>
          <DialogDescription className="text-left">
            Нэг удаагийн төлбөр: <span className="font-semibold text-foreground">{formatPrice(movie.price)}</span>
          </DialogDescription>
        </DialogHeader>
        <ol className="flex flex-col gap-3">
          {steps.map(({ icon: Icon, text }, i) => (
            <li key={text} className="flex items-center gap-3 rounded-lg bg-secondary p-3 text-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className="mr-1 text-muted-foreground">{i + 1}.</span>
                {text}
              </span>
            </li>
          ))}
        </ol>
        <div className="flex items-start gap-2 rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" />
          Төлбөрийн систем болон бүртгэл одоогоор хөгжүүлэлтийн шатанд байна. Удахгүй
          нээгдэнэ — трейлерийг та одоо ч үнэгүй үзэх боломжтой.
        </div>
        <Button disabled className="w-full">
          Тун удахгүй
        </Button>
      </DialogContent>
    </Dialog>
  );
}
