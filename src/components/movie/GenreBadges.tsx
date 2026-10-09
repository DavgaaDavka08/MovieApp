import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types/movie";
import { cn } from "@/lib/utils";

type Props = {
  categories: Category[];
  active?: string;
  hrefFor?: (slug: string) => string;
};

/** Төрлийн жагсаалт — shadcn Badge */
export function GenreBadges({
  categories,
  active,
  hrefFor = (slug) => `/movies?category=${slug}`,
}: Props) {
  return (
    <div className="flex flex-wrap gap-4">
      {categories.map((c) => {
        const isActive = active === c.slug;
        return (
          <Link key={c.slug} href={hrefFor(c.slug)}>
            <Badge
              variant={isActive ? "default" : "outline"}
              className={cn("gap-1 rounded-full", !isActive && "hover:bg-accent")}
            >
              {c.name}
              <ChevronRight className="h-3 w-3" />
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}
