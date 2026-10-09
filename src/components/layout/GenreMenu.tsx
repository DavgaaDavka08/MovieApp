import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { GenreBadges } from "@/components/movie/GenreBadges";
import { getAllCategories } from "@/lib/categories";

export function GenreMenu({ compact = false }: { compact?: boolean }) {
  const all = getAllCategories();
  return (
    <Popover>
      <PopoverTrigger asChild>
        {compact ? (
          <Button variant="outline" size="icon" aria-label="Төрөл">
            <ChevronDown />
          </Button>
        ) : (
          <Button variant="outline">
            <ChevronDown /> Төрөл
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(577px,calc(100vw-40px))] p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h4 className="text-2xl font-semibold">Төрөл</h4>
            <p className="text-base text-muted-foreground">Төрлөөр нь кино сонгох</p>
          </div>
          <Separator />
          <GenreBadges categories={all.filter((c) => c.kind === "genre")} />
          <Separator />
          <GenreBadges categories={all.filter((c) => c.kind === "region")} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
