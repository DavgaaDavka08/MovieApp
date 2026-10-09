import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Category } from "@/types/movie";
import { cn } from "@/lib/utils";

type Props = {
  categories: Category[];
  active?: string;
  /** ангиллын slug-аас линк үүсгэх */
  hrefFor?: (slug: string | null) => string;
  showAll?: boolean;
};

export function CategoryChips({
  categories,
  active,
  hrefFor = (slug) => (slug ? `/movies?category=${slug}` : "/movies"),
  showAll = false,
}: Props) {
  const chip =
    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-colors";
  return (
    <div className="flex flex-wrap gap-2">
      {showAll && (
        <Link
          href={hrefFor(null)}
          className={cn(
            chip,
            !active ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"
          )}
        >
          Бүгд
        </Link>
      )}
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={hrefFor(c.slug)}
          className={cn(
            chip,
            active === c.slug
              ? "border-primary bg-primary text-primary-foreground"
              : "text-foreground hover:bg-accent"
          )}
        >
          {c.name}
          <ChevronRight className="h-3 w-3" />
        </Link>
      ))}
    </div>
  );
}
