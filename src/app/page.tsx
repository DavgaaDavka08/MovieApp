import { HeroCarousel } from "@/components/movie/HeroCarousel";
import { MovieSection } from "@/components/movie/MovieSection";
import {
  getFeaturedMovies,
  getMoviesByCategory,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "@/lib/movies";

// Жагсаалтуудыг цаг тутам шинэчилнэ
export const revalidate = 3600;

export default async function Home() {
  const [featured, upcoming, popular, topRated, mongolian, korean] = await Promise.all([
    getFeaturedMovies(),
    getUpcomingMovies(),
    getPopularMovies(),
    getTopRatedMovies(),
    getMoviesByCategory("mongolian"),
    getMoviesByCategory("korean"),
  ]);

  const nothingLoaded = featured.length === 0 && popular.length === 0;

  return (
    <div className="flex flex-col gap-8 lg:gap-[52px]">
      {featured.length > 0 && <HeroCarousel movies={featured} />}

      {nothingLoaded && (
        <div className="mx-auto mt-10 max-w-lg rounded-lg border px-6 py-10 text-center">
          <p className="font-semibold">Кинонуудыг ачаалж чадсангүй</p>
          <p className="mt-2 text-sm text-muted-foreground">
            .env.local дахь TMDB_TOKEN болон интернет холболтоо шалгана уу.
          </p>
        </div>
      )}

      <MovieSection title="Удахгүй гарах" movies={upcoming} href="/movies?sort=newest" />
      <MovieSection title="Алдартай" movies={popular} href="/movies?sort=popular" />
      <MovieSection title="Өндөр үнэлгээтэй" movies={topRated} href="/movies?sort=rating" />
      <MovieSection title="Монгол кино" movies={mongolian} href="/movies?category=mongolian" />
      <MovieSection title="Солонгос кино" movies={korean} href="/movies?category=korean" />
    </div>
  );
}
