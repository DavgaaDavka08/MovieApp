import type { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";
import { cn } from "@/lib/utils";

export function MovieGrid({ movies, columns = 5 }: { movies: Movie[]; columns?: 4 | 5 }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-5 sm:grid-cols-3 lg:gap-8",
        columns === 5 ? "md:grid-cols-4 lg:grid-cols-5" : "md:grid-cols-4"
      )}
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
