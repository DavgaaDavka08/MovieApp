import { HeroCarousel } from "@/components/movie/HeroCarousel";
import { MovieRow } from "@/components/movie/MovieRow";
import { CategoryChips } from "@/components/movie/CategoryChips";
import {
  getAllCategories,
  getAllMovies,
  getFeaturedMovies,
  getMoviesByCategory,
  getPopularMovies,
  getPrimaryGenre,
  getRecentlyAdded,
  getTrendingMovies,
  sortMovies,
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

export default function Home() {
  const featured = getFeaturedMovies().map((m) => ({ ...m, genreLabel: getPrimaryGenre(m) }));

  return (
    <div className="flex flex-col gap-10 pb-6 sm:gap-12">
      <HeroCarousel movies={featured} />

      <section className="mx-auto -mt-4 w-full max-w-[1280px] px-4 sm:px-6">
        <CategoryChips categories={getAllCategories()} showAll />
      </section>

      <MovieRow title="Яг одоо тренд" movies={getTrendingMovies()} href="/movies?sort=popular" />
      <MovieRow title="Хамгийн алдартай" movies={getPopularMovies()} href="/movies?sort=popular" />
      <MovieRow title="Шинээр нэмэгдсэн" movies={getRecentlyAdded()} href="/movies?sort=newest" />
      {categoryRows.map((row) => (
        <MovieRow
          key={row.slug}
          title={row.title}
          movies={getMoviesByCategory(row.slug)}
          href={`/movies?category=${row.slug}`}
        />
      ))}
      <MovieRow title="Бүх кино" movies={sortMovies(getAllMovies(), "title")} href="/movies" />
    </div>
  );
}
