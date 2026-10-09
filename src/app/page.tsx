import { HeroCarousel } from "@/components/movie/HeroCarousel";
import { MovieRow } from "@/components/movie/MovieRow";
import { CategoryChips } from "@/components/movie/CategoryChips";
import { getAllCategories, getPrimaryGenre } from "@/lib/categories";
import {
  getFeaturedMovies,
  getMoviesByCategory,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
} from "@/lib/movies";
import type { CategorySlug } from "@/types/movie";

const categoryRows: { slug: CategorySlug; title: string }[] = [
  { slug: "mongolian", title: "Монгол кино" },
  { slug: "action", title: "Тулаант кино" },
  { slug: "comedy", title: "Инээдмийн кино" },
  { slug: "drama", title: "Драм" },
  { slug: "romance", title: "Романтик" },
  { slug: "horror", title: "Аймшгийн кино" },
  { slug: "thriller", title: "Триллер" },
  { slug: "korean", title: "Солонгос кино" },
  { slug: "chinese", title: "Хятад кино" },
  { slug: "animation", title: "Хүүхэлдэйн кино" },
];

// Жагсаалтуудыг цаг тутам шинэчилнэ
export const revalidate = 3600;

export default async function Home() {
  const [featured, trending, popular, nowPlaying, topRated, ...byCategory] = await Promise.all([
    getFeaturedMovies(),
    getTrendingMovies(),
    getPopularMovies(),
    getNowPlayingMovies(),
    getTopRatedMovies(),
    ...categoryRows.map((r) => getMoviesByCategory(r.slug)),
  ]);

  const heroMovies = featured.map((m) => ({ ...m, genreLabel: getPrimaryGenre(m) }));
  const nothingLoaded = heroMovies.length === 0 && popular.length === 0;

  return (
    <div className="flex flex-col gap-10 pb-6 sm:gap-12">
      {heroMovies.length > 0 && <HeroCarousel movies={heroMovies} />}

      {nothingLoaded && (
        <div className="mx-auto mt-10 max-w-lg rounded-xl border border-dashed px-6 py-10 text-center">
          <p className="font-semibold">Кинонуудыг ачаалж чадсангүй</p>
          <p className="mt-2 text-sm text-muted-foreground">
            TMDB_TOKEN тохиргоо болон интернет холболтоо шалгана уу.
          </p>
        </div>
      )}

      <section className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <CategoryChips categories={getAllCategories()} showAll />
      </section>

      <MovieRow title="Яг одоо тренд" movies={trending} href="/movies?sort=popular" />
      <MovieRow title="Хамгийн алдартай" movies={popular} href="/movies?sort=popular" />
      <MovieRow title="Шинээр нэмэгдсэн" movies={nowPlaying} href="/movies?sort=newest" />
      <MovieRow title="Өндөр үнэлгээтэй" movies={topRated} href="/movies?sort=rating" />
      {categoryRows.map((row, i) => (
        <MovieRow
          key={row.slug}
          title={row.title}
          movies={byCategory[i]}
          href={`/movies?category=${row.slug}`}
        />
      ))}
    </div>
  );
}
