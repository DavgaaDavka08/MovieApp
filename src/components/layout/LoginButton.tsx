"use client";

import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/** Phase 2-т утасны дугаар + нууц үгийн бүртгэлээр солигдоно */
export function LoginButton({ className }: { className?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn("h-9 gap-2", className)}>
          <UserRound className="h-4 w-4" />
          Нэвтрэх
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-left">Нэвтрэх / Бүртгүүлэх</DialogTitle>
          <DialogDescription className="text-left">
            Утасны дугаар болон нууц үгээр нэвтрэх систем удахгүй нээгдэнэ. Кино үзэх,
            хайх, трейлер үзэхэд бүртгэл шаардлагагүй.
          </DialogDescription>
        </DialogHeader>
        <Button disabled className="w-full">
          Тун удахгүй
        </Button>
      </DialogContent>
    </Dialog>
  );
}
