import { Star } from "lucide-react";
import { formatRating } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Rating({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1 text-sm", className)}>
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="font-medium">{formatRating(value)}</span>
      <span className="text-xs text-muted-foreground">/10</span>
    </div>
  );
}
