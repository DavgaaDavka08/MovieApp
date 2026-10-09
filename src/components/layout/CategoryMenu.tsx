import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CategoryChips } from "@/components/movie/CategoryChips";
import { getAllCategories } from "@/lib/categories";

export function CategoryMenu() {
  const all = getAllCategories();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-9 gap-1 px-3">
          Ангилал <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(520px,90vw)] p-5">
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="text-xl font-semibold">Төрөл</h4>
            <p className="text-sm text-muted-foreground">Төрлөөр нь кино сонгох</p>
          </div>
          <CategoryChips categories={all.filter((c) => c.kind === "genre")} />
          <div className="h-px w-full bg-border" />
          <h4 className="text-base font-semibold">Улсаар</h4>
          <CategoryChips categories={all.filter((c) => c.kind === "region")} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
