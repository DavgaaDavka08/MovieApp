import Link from "next/link";
import { Star } from "lucide-react";
import type { Movie } from "@/types/movie";
import { formatPrice, formatRating } from "@/lib/format";
import { getPrimaryGenre } from "@/lib/movies";
import { cn } from "@/lib/utils";
import { MoviePoster } from "./MoviePoster";

export function MovieCard({ movie, className }: { movie: Movie; className?: string }) {
  return (
    <Link
      href={`/movie/${movie.slug}`}
      className={cn(
        "group flex flex-col gap-2 rounded-lg bg-secondary p-2 transition hover:-translate-y-1 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <div className="relative">
        <MoviePoster movie={movie} className="aspect-[2/3] w-full rounded-md" />
        <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white">
          {movie.ageRating}
        </span>
        <span className="absolute inset-0 flex items-center justify-center rounded-md bg-black/40 opacity-0 transition group-hover:opacity-100">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Трейлер үзэх
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-1 px-1 pb-1">
        <div className="flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{formatRating(movie.rating)}</span>
          <span className="text-xs text-muted-foreground">/10</span>
        </div>
        <h3 className="line-clamp-1 text-base font-medium leading-6">{movie.title}</h3>
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {movie.year} · {getPrimaryGenre(movie)}
        </p>
        <p className="text-sm font-semibold text-primary">{formatPrice(movie.price)}</p>
      </div>
    </Link>
  );
}
