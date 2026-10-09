import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { CategoryChips } from "@/components/movie/CategoryChips";
import { MovieGrid } from "@/components/movie/MovieGrid";
import {
  SORT_OPTIONS,
  getAllCategories,
  getAllMovies,
  getCategory,
  isMovieSort,
  searchMovies,
  sortMovies,
} from "@/lib/movies";
import type { CategorySlug, MovieSort } from "@/types/movie";
import { cn } from "@/lib/utils";

type SearchParams = Promise<{ q?: string; category?: string; sort?: string }>;

export const metadata: Metadata = {
  title: "Бүх кино",
  description: "Ангилал, хайлт, эрэмбэлэлтээр хүссэн киногоо олоорой.",
};

function buildHref(params: { q?: string; category?: string | null; sort?: string }) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.category) sp.set("category", params.category);
  if (params.sort && params.sort !== "popular") sp.set("sort", params.sort);
  const s = sp.toString();
  return s ? `/movies?${s}` : "/movies";
}

export default async function MoviesPage({ searchParams }: { searchParams: SearchParams }) {
  const { q = "", category, sort } = await searchParams;
  const activeCategory = category ? getCategory(category) : undefined;
  const activeSort: MovieSort = isMovieSort(sort) ? sort : "popular";

  let movies = getAllMovies();
  if (activeCategory) {
    movies = movies.filter((m) => m.categories.includes(activeCategory.slug as CategorySlug));
  }
  movies = sortMovies(searchMovies(q, movies), activeSort);

  const heading = q
    ? `“${q}” хайлтын илэрц`
    : activeCategory
      ? activeCategory.name
      : "Бүх кино";

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="font-display text-3xl font-semibold uppercase tracking-wide sm:text-4xl">{heading}</h1>
        <p className="text-sm text-muted-foreground">{movies.length} кино олдлоо</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <form action="/movies" className="flex gap-2">
            {activeCategory && <input type="hidden" name="category" value={activeCategory.slug} />}
            <input
              name="q"
              defaultValue={q}
              placeholder="Хайх..."
              className="h-10 w-full rounded-md border bg-secondary px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button className="h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">
              Хайх
            </button>
          </form>

          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Ангилал</h2>
            <CategoryChips
              categories={getAllCategories()}
              active={activeCategory?.slug}
              showAll
              hrefFor={(slug) => buildHref({ q, category: slug, sort: activeSort })}
            />
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Эрэмбэлэх</h2>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((o) => (
                <Link
                  key={o.value}
                  href={buildHref({ q, category: activeCategory?.slug, sort: o.value })}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-xs font-semibold transition",
                    activeSort === o.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  )}
                >
                  {o.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <section>
          {movies.length > 0 ? (
            <MovieGrid movies={movies} />
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
              <SearchX className="h-10 w-10 text-muted-foreground" />
              <p className="font-semibold">Таны хайлтад тохирох кино олдсонгүй</p>
              <p className="text-sm text-muted-foreground">Өөр үгээр хайх эсвэл ангиллаа солиод үзээрэй.</p>
              <Link href="/movies" className="mt-2 text-sm font-semibold text-primary hover:underline">
                Бүх киног харах
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
