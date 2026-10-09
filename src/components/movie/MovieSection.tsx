import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Movie } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MovieGrid } from "./MovieGrid";

type Props = {
  title: string;
  movies: Movie[];
  href?: string;
  limit?: number;
  className?: string;
};

export function MovieSection({ title, movies, href, limit = 10, className }: Props) {
  if (movies.length === 0) return null;
  return (
    <section className={cn("mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-5 lg:px-0", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        {href && (
          <Button asChild variant="link" className="px-0 text-foreground">
            <Link href={href}>
              Цааш үзэх <ArrowRight />
            </Link>
          </Button>
        )}
      </div>
      <MovieGrid movies={movies.slice(0, limit)} />
    </section>
  );
}
