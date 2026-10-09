import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { CategoryChips } from "@/components/movie/CategoryChips";
import { MovieGrid } from "@/components/movie/MovieGrid";
import { getAllCategories, getCategory } from "@/lib/categories";
import { SORT_OPTIONS, discoverMovies, isMovieSort, searchMovies } from "@/lib/movies";
import type { MovieSort } from "@/types/movie";
import { cn } from "@/lib/utils";

type SearchParams = Promise<{ q?: string; category?: string; sort?: string; page?: string }>;

export const metadata: Metadata = {
  title: "Бүх кино",
  description: "Ангилал, хайлт, эрэмбэлэлтээр хүссэн киногоо олоорой.",
};

function buildHref(params: { q?: string; category?: string | null; sort?: string; page?: number }) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.category) sp.set("category", params.category);
  if (params.sort && params.sort !== "popular") sp.set("sort", params.sort);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  const s = sp.toString();
  return s ? `/movies?${s}` : "/movies";
}

export default async function MoviesPage({ searchParams }: { searchParams: SearchParams }) {
  const { q = "", category, sort, page: pageParam } = await searchParams;
  const activeCategory = getCategory(category);
  const activeSort: MovieSort = isMovieSort(sort) ? sort : "popular";
  const page = Math.max(1, Number(pageParam) || 1);

  // Хайлтын үед TMDB шүүлтүүр/эрэмбэлэлт ажиллахгүй тул зөвхөн хайлтын илэрцийг харуулна
  const data = q.trim()
    ? await searchMovies(q, page)
    : await discoverMovies({ category: activeCategory?.slug, sort: activeSort, page });
  const movies = data.results;

  const heading = q ? `“${q}” хайлтын илэрц` : activeCategory ? activeCategory.name : "Бүх кино";
  const pageHref = (p: number) =>
    buildHref({ q, category: activeCategory?.slug, sort: activeSort, page: p });

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="font-display text-3xl font-semibold uppercase tracking-wide sm:text-4xl">{heading}</h1>
        <p className="text-sm text-muted-foreground">
          {new Intl.NumberFormat("en-US").format(data.totalResults)} кино олдлоо
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <form action="/movies" className="flex gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="Киноны нэрээр хайх..."
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
              active={q ? undefined : activeCategory?.slug}
              showAll
              hrefFor={(slug) => buildHref({ category: slug, sort: activeSort })}
            />
          </div>

          {!q && (
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold">Эрэмбэлэх</h2>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((o) => (
                  <Link
                    key={o.value}
                    href={buildHref({ category: activeCategory?.slug, sort: o.value })}
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
          )}
        </aside>

        <section>
          {movies.length > 0 ? (
            <>
              <MovieGrid movies={movies} />
              {data.totalPages > 1 && (
                <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Хуудаслалт">
                  {page > 1 ? (
                    <Link href={pageHref(page - 1)} className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-accent">
                      <ChevronLeft className="h-4 w-4" /> Өмнөх
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm opacity-40">
                      <ChevronLeft className="h-4 w-4" /> Өмнөх
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {page} / {data.totalPages}
                  </span>
                  {page < data.totalPages ? (
                    <Link href={pageHref(page + 1)} className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-accent">
                      Дараах <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm opacity-40">
                      Дараах <ChevronRight className="h-4 w-4" />
                    </span>
                  )}
                </nav>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
              <SearchX className="h-10 w-10 text-muted-foreground" />
              <p className="font-semibold">Тохирох кино олдсонгүй</p>
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
