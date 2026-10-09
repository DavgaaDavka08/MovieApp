import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MoviePoster } from "@/components/movie/MoviePoster";
import { MovieSection } from "@/components/movie/MovieSection";
import { Rating } from "@/components/movie/Rating";
import { ShareButton } from "@/components/movie/ShareButton";
import { TrailerPlayer } from "@/components/movie/TrailerPlayer";
import { WatchFullMovieButton } from "@/components/movie/WatchFullMovieButton";
import { formatDuration, formatPrice } from "@/lib/format";
import { getCategory } from "@/lib/categories";
import { getMovieBySlug as fetchMovie, getRelatedMovies } from "@/lib/movies";

// generateMetadata болон хуудас хоёр нэг хүсэлтээр мэдээллээ авна
const getMovieBySlug = cache(fetchMovie);

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ play?: string }>;

/** Кино бүр өөрийн давтагдашгүй URL-тэй: /movie/[slug], жишээ нь /movie/550-fight-club */
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);
  if (!movie) return { title: "Кино олдсонгүй" };
  const title = movie.year ? `${movie.title} (${movie.year})` : movie.title;
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
  const movie = await getMovieBySlug(slug);
  if (!movie) notFound();
  // /movie/550 гэх мэт богино линкийг үндсэн slug руу шилжүүлнэ
  if (movie.slug !== slug) {
    permanentRedirect(`/movie/${movie.slug}${play ? `?play=${play}` : ""}`);
  }

  const related = await getRelatedMovies(movie.id);
  const meta = [movie.releaseDate, movie.ageRating, formatDuration(movie.duration)].filter(
    (v) => v && v !== "—"
  );
  const credits: { label: string; value: string }[] = [
    { label: "Найруулагч", value: movie.director ?? "—" },
    { label: "Жүжигчид", value: movie.cast.length ? movie.cast.join(" · ") : "—" },
    { label: "Хэл", value: movie.spokenLanguages.join(", ") || movie.language },
  ];

  return (
    <div className="flex flex-col gap-8 pt-8 lg:pt-[52px]">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-6 px-5 lg:px-0">
        {/* Гарчиг */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold lg:text-4xl">{movie.title}</h1>
            {movie.originalTitle && <p className="text-sm text-muted-foreground">{movie.originalTitle}</p>}
            <p className="text-sm lg:text-lg">{meta.join(" · ")}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end">
            <span className="hidden text-xs font-medium lg:block">Үнэлгээ</span>
            <Rating value={movie.rating} className="lg:text-lg" />
            <span className="text-xs text-muted-foreground">
              {new Intl.NumberFormat("en-US", { notation: "compact" }).format(movie.voteCount)} санал
            </span>
          </div>
        </div>

        {/* Постер + трейлер */}
        <div className="flex gap-8">
          <MoviePoster
            movie={movie}
            className="hidden aspect-[2/3] w-[290px] shrink-0 rounded lg:block"
            sizes="290px"
            priority
          />
          <div className="flex-1">
            <TrailerPlayer movie={movie} autoStart={play === "trailer"} />
          </div>
        </div>

        {/* Тайлбар */}
        <div className="flex gap-6">
          <MoviePoster
            movie={movie}
            className="aspect-[2/3] w-[100px] shrink-0 rounded lg:hidden"
            sizes="100px"
          />
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-3">
              {movie.categories.map((c) => (
                <Link key={c} href={`/movies?category=${c}`}>
                  <Badge variant="outline" className="rounded-full hover:bg-accent">
                    {getCategory(c)?.name ?? c}
                  </Badge>
                </Link>
              ))}
            </div>
            <p className="text-base leading-6">{movie.description}</p>
          </div>
        </div>

        {/* Үзэх */}
        <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Бүтэн киног үзэх</p>
            <p className="text-sm text-muted-foreground">
              Трейлер үнэгүй · Нэг удаагийн төлбөр {formatPrice(movie.price)}
            </p>
          </div>
          <div className="flex gap-3">
            <ShareButton title={movie.title} path={`/movie/${movie.slug}`} />
            <WatchFullMovieButton movie={movie} />
          </div>
        </div>

        {/* Баг бүрэлдэхүүн */}
        <div className="flex flex-col gap-5">
          {credits.map((c) => (
            <div key={c.label} className="flex flex-col gap-1">
              <div className="flex gap-[53px]">
                <span className="w-[100px] shrink-0 font-bold">{c.label}</span>
                <span>{c.value}</span>
              </div>
              <Separator className="mt-4" />
            </div>
          ))}
        </div>
      </div>

      <MovieSection title="Төстэй кинонууд" movies={related} limit={5} className="max-w-[1080px]" />
    </div>
  );
}
