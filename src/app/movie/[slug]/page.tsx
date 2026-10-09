import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlayCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoviePoster } from "@/components/movie/MoviePoster";
import { MovieRow } from "@/components/movie/MovieRow";
import { ShareButton } from "@/components/movie/ShareButton";
import { TrailerPlayer } from "@/components/movie/TrailerPlayer";
import { WatchFullMovieButton } from "@/components/movie/WatchFullMovieButton";
import { formatDuration, formatPrice, formatRating } from "@/lib/format";
import { getAllMovies, getCategory, getMovieBySlug, getRelatedMovies } from "@/lib/movies";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ play?: string }>;

/** Кино бүр өөрийн давтагдашгүй URL-тэй: /movie/[slug] */
export function generateStaticParams() {
  return getAllMovies().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const movie = getMovieBySlug(slug);
  if (!movie) return { title: "Кино олдсонгүй" };
  const title = `${movie.title} (${movie.year})`;
  const image = movie.backdrop ?? movie.poster;
  return {
    title,
    description: movie.description,
    alternates: { canonical: `/movie/${movie.slug}` },
    // Facebook-д линк хуваалцахад зураг, нэр, тайлбар гарна
    openGraph: {
      type: "video.movie",
      title,
      description: movie.description,
      url: `/movie/${movie.slug}`,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description: movie.description },
  };
}

export default async function MoviePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const { play } = await searchParams;
  const movie = getMovieBySlug(slug);
  if (!movie) notFound();

  const related = getRelatedMovies(movie);
  const details: { label: string; value: string }[] = [
    { label: "Найруулагч", value: movie.director },
    { label: "Жүжигчид", value: movie.cast.join(", ") },
    { label: "Хэл", value: movie.language },
    { label: "Хадмал", value: movie.subtitles.length ? movie.subtitles.join(", ") : "Байхгүй" },
    { label: "Үргэлжлэх хугацаа", value: formatDuration(movie.duration) },
    { label: "Насны ангилал", value: movie.ageRating },
  ];

  return (
    <div className="flex flex-col gap-12">
      {/* Баннер */}
      <section className="relative">
        <div className="absolute inset-0 h-[420px] overflow-hidden sm:h-[520px]">
          <MoviePoster movie={movie} variant="backdrop" className="absolute inset-0 opacity-60" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
        </div>

        <div className="relative mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 pt-8 sm:px-6 sm:pt-16 md:flex-row md:items-end md:gap-10">
          <MoviePoster
            movie={movie}
            className="hidden aspect-[2/3] w-[260px] shrink-0 rounded-xl shadow-2xl md:block"
            sizes="260px"
          />
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {movie.categories.map((c) => (
                <Link
                  key={c}
                  href={`/movies?category=${c}`}
                  className="rounded-full border border-foreground/20 bg-background/40 px-2.5 py-0.5 text-xs font-semibold backdrop-blur hover:bg-accent"
                >
                  {getCategory(c)?.name ?? c}
                </Link>
              ))}
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold uppercase leading-none tracking-wide sm:text-6xl">
                {movie.title}
              </h1>
              {movie.originalTitle && (
                <p className="mt-2 text-sm text-muted-foreground">{movie.originalTitle}</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {formatRating(movie.rating)}
                <span className="text-xs font-normal text-muted-foreground">/10</span>
              </span>
              <span>{movie.year}</span>
              <span>·</span>
              <span>{formatDuration(movie.duration)}</span>
              <span>·</span>
              <span>{movie.language}</span>
              <span className="rounded border px-1.5 text-xs">{movie.ageRating}</span>
            </div>
            <p className="max-w-2xl text-base leading-7">{movie.description}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <WatchFullMovieButton movie={movie} />
              <div className="flex gap-3">
                <Button asChild size="lg" variant="secondary" className="flex-1 gap-2 sm:flex-none">
                  <a href="#trailer">
                    <PlayCircle className="h-5 w-5" /> Трейлер үзэх
                  </a>
                </Button>
                <ShareButton title={movie.title} path={`/movie/${movie.slug}`} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Трейлер үнэгүй · Бүтэн кино нэг удаагийн төлбөр {formatPrice(movie.price)} · Сар бүрийн захиалга шаардлагагүй
            </p>
          </div>
        </div>
      </section>

      {/* Трейлер + дэлгэрэнгүй */}
      <section className="mx-auto grid w-full max-w-[1280px] gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold sm:text-2xl">Трейлер</h2>
          <TrailerPlayer movie={movie} autoStart={play === "trailer"} />
          <div className="mt-4 flex flex-col gap-2">
            <h2 className="text-xl font-semibold sm:text-2xl">Агуулга</h2>
            <p className="leading-7 text-muted-foreground">{movie.synopsis}</p>
          </div>
        </div>

        <aside className="flex flex-col gap-4 rounded-xl bg-secondary p-5 lg:self-start">
          <dl className="flex flex-col divide-y divide-border">
            {details.map((d) => (
              <div key={d.label} className="grid grid-cols-[120px_1fr] gap-3 py-3 text-sm">
                <dt className="font-semibold">{d.label}</dt>
                <dd className="text-muted-foreground">{d.value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex items-center justify-between rounded-lg bg-background p-4">
            <span className="text-sm text-muted-foreground">Үнэ</span>
            <span className="text-xl font-bold text-primary">{formatPrice(movie.price)}</span>
          </div>
          <WatchFullMovieButton movie={movie} className="w-full" />
          {movie.isSample && (
            <p className="text-xs text-muted-foreground">
              Жишээ мэдээлэл. Трейлер: {movie.trailer.credit}
            </p>
          )}
        </aside>
      </section>

      <MovieRow title="Танд таалагдаж магадгүй" movies={related} href="/movies" />
    </div>
  );
}
