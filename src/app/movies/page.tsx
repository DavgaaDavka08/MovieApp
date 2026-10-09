import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { GenreBadges } from "@/components/movie/GenreBadges";
import { MovieGrid } from "@/components/movie/MovieGrid";
import { MoviePagination } from "@/components/movie/MoviePagination";
import { getAllCategories, getCategory } from "@/lib/categories";
import { SORT_OPTIONS, discoverMovies, isMovieSort, searchMovies } from "@/lib/movies";
import type { MovieSort } from "@/types/movie";

type SearchParams = Promise<{ q?: string; category?: string; sort?: string; page?: string }>;

export const metadata: Metadata = {
  title: "Бүх кино",
  description: "Төрөл, хайлт, эрэмбэлэлтээр хүссэн киногоо олоорой.",
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

  // Хайлтын үед TMDB төрлийн шүүлтүүр ажиллахгүй тул зөвхөн хайлтын илэрцийг харуулна
  const data = q.trim()
    ? await searchMovies(q, page)
    : await discoverMovies({ category: activeCategory?.slug, sort: activeSort, page });

  const heading = q ? "Хайлтын илэрц" : activeCategory ? activeCategory.name : "Бүх кино";
  const all = getAllCategories();
  const genreHref = (slug: string) =>
    buildHref({ category: activeCategory?.slug === slug ? null : slug, sort: activeSort });

  return (
    <div className="mx-auto w-full max-w-[1280px] px-5 py-8 lg:px-0 lg:py-[52px]">
      <h1 className="mb-8 text-2xl font-semibold lg:text-3xl">{heading}</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:w-[387px] lg:shrink-0 lg:self-start">
          <form action="/movies" className="flex gap-2">
            <Input name="q" defaultValue={q} placeholder="Киноны нэрээр хайх..." />
            <Button type="submit">Хайх</Button>
          </form>

          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold">Төрөл</h2>
            <p className="text-base text-muted-foreground">Төрлөөр нь кино сонгох</p>
          </div>
          <GenreBadges
            categories={all.filter((c) => c.kind === "genre")}
            active={q ? undefined : activeCategory?.slug}
            hrefFor={genreHref}
          />
          <GenreBadges
            categories={all.filter((c) => c.kind === "region")}
            active={q ? undefined : activeCategory?.slug}
            hrefFor={genreHref}
          />

          {!q && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((o) => (
                  <Button
                    key={o.value}
                    asChild
                    size="sm"
                    variant={activeSort === o.value ? "default" : "outline"}
                  >
                    <Link href={buildHref({ category: activeCategory?.slug, sort: o.value })}>
                      {o.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </>
          )}
        </aside>

        <Separator orientation="vertical" className="hidden h-auto lg:block" />

        <section className="flex flex-1 flex-col gap-8">
          <p className="text-xl font-semibold">
            {new Intl.NumberFormat("en-US").format(data.totalResults)} кино
            {q && <> &ldquo;{q}&rdquo;-д олдлоо</>}
          </p>
          {data.results.length > 0 ? (
            <>
              <MovieGrid movies={data.results} columns={4} />
              <MoviePagination
                page={page}
                totalPages={data.totalPages}
                hrefFor={(p) => buildHref({ q, category: activeCategory?.slug, sort: activeSort, page: p })}
              />
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-lg border px-6 py-16 text-center">
              <p className="font-semibold">Тохирох кино олдсонгүй</p>
              <p className="text-sm text-muted-foreground">Өөр үгээр хайх эсвэл төрлөө солиод үзээрэй.</p>
              <Button asChild variant="outline">
                <Link href="/movies">Бүх киног харах</Link>
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
