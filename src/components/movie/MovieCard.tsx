import Link from "next/link";
import type { Movie } from "@/types/movie";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MoviePoster } from "./MoviePoster";
import { Rating } from "./Rating";

export function MovieCard({ movie, className }: { movie: Movie; className?: string }) {
  return (
    <Link href={`/movie/${movie.slug}`} className={cn("group block", className)}>
      <Card className="h-full overflow-hidden border-0 bg-secondary shadow-none transition-colors group-hover:bg-accent">
        <MoviePoster
          movie={movie}
          className="aspect-[2/3] w-full transition-opacity group-hover:opacity-80"
        />
        <CardContent className="flex flex-col gap-1 p-2">
          <Rating value={movie.rating} />
          <h3 className="line-clamp-2 text-sm leading-5 sm:text-base sm:leading-6">{movie.title}</h3>
        </CardContent>
      </Card>
    </Link>
  );
}
