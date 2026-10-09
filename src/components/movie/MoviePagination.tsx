import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type Props = {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
};

function pageList(page: number, total: number): (number | "…")[] {
  const set = new Set([1, total, page - 1, page, page + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

export function MoviePagination({ page, totalPages, hrefFor }: Props) {
  if (totalPages <= 1) return null;
  const disabled = "pointer-events-none opacity-50";
  return (
    <Pagination className="justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            href={hrefFor(page - 1)}
            size="default"
            aria-disabled={page <= 1}
            className={cn("gap-1 pl-2.5", page <= 1 && disabled)}
          >
            <ChevronLeft className="h-4 w-4" /> Өмнөх
          </PaginationLink>
        </PaginationItem>
        {pageList(page, totalPages).map((p, i) =>
          p === "…" ? (
            <PaginationItem key={`e${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink href={hrefFor(p)} isActive={p === page}>
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationLink
            href={hrefFor(page + 1)}
            size="default"
            aria-disabled={page >= totalPages}
            className={cn("gap-1 pr-2.5", page >= totalPages && disabled)}
          >
            Дараах <ChevronRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
