import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";

type Props = {
  title: string;
  movies: Movie[];
  href?: string;
};

/** Хэвтээ гүйдэг киноны мөр. Гар утсанд хуруугаар гүйлгэнэ. */
export function MovieRow({ title, movies, href }: Props) {
  if (movies.length === 0) return null;
  return (
    <section className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">{title}</h2>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
          >
            Бүгдийг үзэх <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            className="w-[150px] shrink-0 snap-start sm:w-[190px] lg:w-[220px]"
          />
        ))}
      </div>
    </section>
  );
}
