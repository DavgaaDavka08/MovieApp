import { categoriesFromTmdb, getCategory } from "@/lib/categories";
import type { CategorySlug, Movie, MovieDetail, MovieSort, Paged, Trailer } from "@/types/movie";
import {
  IMG,
  TmdbError,
  tmdb,
  type TmdbDetail,
  type TmdbList,
  type TmdbListMovie,
  type TmdbVideo,
} from "./tmdb";

/**
 * Киноны өгөгдөлд хандах давхарга (сервер тал).
 * Одоогоор TMDB-ээс уншина. Phase 2-т өөрсдийн өгөгдлийн сан (эрх бүхий кинонууд,
 * үнэ, бүтэн бичлэг) руу шилжихэд зөвхөн энэ файлыг өөрчилнө.
 */

export const DEFAULT_PRICE = 10_000;

const PALETTES: [string, string][] = [
  ["#3b0a0a", "#0b0b0f"],
  ["#0f2a3a", "#050507"],
  ["#2f4a12", "#0b0b0f"],
  ["#3a2a0a", "#060606"],
  ["#1e3a5f", "#05070d"],
  ["#134e4a", "#020607"],
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** /movie/550-fight-club хэлбэрийн давтагдашгүй slug */
export function movieSlug(id: number, title: string): string {
  const s = slugify(title);
  return s ? `${id}-${s}` : String(id);
}

/** slug-аас TMDB id-г гаргана: "550-fight-club" → 550 */
export function idFromSlug(slug: string): number | null {
  const m = /^(\d+)/.exec(slug);
  return m ? Number(m[1]) : null;
}

const isAscii = (s?: string) => !!s && /^[\x00-\x7F]*$/.test(s);

/** Slug-д латин үсгээр бичигдсэн нэрийг ашиглана (англи нэр → эх нэр → зөвхөн id) */
function slugSource(m: { title: string; original_title?: string }): string {
  if (isAscii(m.title)) return m.title;
  if (isAscii(m.original_title)) return m.original_title!;
  return "";
}

function toMovie(m: TmdbListMovie | TmdbDetail): Movie {
  const genreIds = "genre_ids" in m && m.genre_ids ? m.genre_ids : "genres" in m ? m.genres.map((g) => g.id) : [];
  const year = m.release_date ? Number(m.release_date.slice(0, 4)) || null : null;
  return {
    id: m.id,
    slug: movieSlug(m.id, slugSource(m)),
    title: m.title,
    originalTitle: m.original_title && m.original_title !== m.title ? m.original_title : undefined,
    description: m.overview || "Тайлбар удахгүй нэмэгдэнэ.",
    year,
    releaseDate: m.release_date || null,
    price: DEFAULT_PRICE,
    categories: categoriesFromTmdb(genreIds, m.original_language),
    rating: m.vote_average ?? 0,
    voteCount: m.vote_count ?? 0,
    popularity: m.popularity ?? 0,
    poster: m.poster_path ? `${IMG}/w500${m.poster_path}` : undefined,
    backdrop: m.backdrop_path ? `${IMG}/w1280${m.backdrop_path}` : undefined,
    palette: PALETTES[m.id % PALETTES.length],
  };
}

function toPaged(list: TmdbList): Paged<Movie> {
  return {
    results: list.results.map(toMovie),
    page: list.page,
    // TMDB 500-аас дээш хуудас зөвшөөрдөггүй
    totalPages: Math.min(list.total_pages, 500),
    totalResults: list.total_results,
  };
}

const EMPTY: Paged<Movie> = { results: [], page: 1, totalPages: 0, totalResults: 0 };

/** Алдаа гарвал хуудсыг унагахгүйн тулд хоосон жагсаалт буцаана */
async function safeList(path: string, params: Record<string, string | number | undefined> = {}) {
  try {
    return toPaged(await tmdb<TmdbList>(path, params));
  } catch (e) {
    console.error("[movies]", (e as Error).message);
    return EMPTY;
  }
}

export async function getTrendingMovies() {
  return (await safeList("/trending/movie/week")).results;
}

export async function getPopularMovies() {
  return (await safeList("/movie/popular")).results;
}

export async function getNowPlayingMovies() {
  return (await safeList("/movie/now_playing")).results;
}

export async function getTopRatedMovies() {
  return (await safeList("/movie/top_rated")).results;
}

export async function getUpcomingMovies() {
  return (await safeList("/movie/upcoming")).results;
}

/** Hero хэсэгт гарах онцлох кинонууд (баннер зурагтай) */
export async function getFeaturedMovies(limit = 6) {
  const list = await getTrendingMovies();
  return list.filter((m) => m.backdrop && m.description).slice(0, limit);
}

const SORT_MAP: Record<MovieSort, string> = {
  popular: "popularity.desc",
  newest: "primary_release_date.desc",
  rating: "vote_average.desc",
  title: "title.asc",
};

export async function discoverMovies(opts: {
  category?: CategorySlug;
  sort?: MovieSort;
  page?: number;
}): Promise<Paged<Movie>> {
  const cat = getCategory(opts.category);
  const sort = opts.sort ?? "popular";
  return safeList("/discover/movie", {
    page: opts.page ?? 1,
    sort_by: SORT_MAP[sort],
    with_genres: cat?.tmdb.genreId,
    with_original_language: cat?.tmdb.language,
    include_adult: "false",
    // Шинэ/үнэлгээгээр эрэмбэлэхэд хог өгөгдлийг шүүнэ
    "vote_count.gte": sort === "rating" ? 200 : sort === "newest" ? 20 : undefined,
    "primary_release_date.lte": sort === "newest" ? new Date().toISOString().slice(0, 10) : undefined,
  });
}

export async function getMoviesByCategory(slug: CategorySlug) {
  return (await discoverMovies({ category: slug })).results;
}

export async function searchMovies(query: string, page = 1): Promise<Paged<Movie>> {
  const q = query.trim();
  if (!q) return EMPTY;
  return safeList("/search/movie", { query: q, page, include_adult: "false" });
}

function pickTrailer(videos: TmdbVideo[] = []): Trailer | null {
  const yt = videos.filter((v) => v.site === "YouTube");
  const score = (v: TmdbVideo) =>
    (v.type === "Trailer" ? 4 : v.type === "Teaser" ? 2 : 0) + (v.official ? 1 : 0);
  const best = [...yt].sort(
    (a, b) => score(b) - score(a) || b.published_at.localeCompare(a.published_at)
  )[0];
  return best ? { provider: "youtube", key: best.key, name: best.name } : null;
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: "Англи",
  mn: "Монгол",
  ko: "Солонгос",
  zh: "Хятад",
  cn: "Хятад (Кантон)",
  ja: "Япон",
  ru: "Орос",
  fr: "Франц",
  de: "Герман",
  es: "Испани",
  it: "Итали",
  hi: "Хинди",
  th: "Тай",
  tr: "Турк",
};

function languageName(code?: string, fallback?: string) {
  if (!code) return fallback ?? "—";
  return LANGUAGE_NAMES[code] ?? fallback ?? code.toUpperCase();
}

export async function getMovieBySlug(slug: string): Promise<MovieDetail | null> {
  const id = idFromSlug(slug);
  if (!id) return null;
  let d: TmdbDetail;
  try {
    d = await tmdb<TmdbDetail>(`/movie/${id}`, {
      append_to_response: "videos,credits,translations,release_dates",
      include_video_language: "mn,en,null",
    });
  } catch (e) {
    if (e instanceof TmdbError && e.message === "not_found") return null;
    throw e;
  }

  // Монгол орчуулга байвал нэр, тайлбарыг монголоор харуулна
  const mn = d.translations?.translations.find((t) => t.iso_639_1 === "mn")?.data;
  const base = toMovie(d);
  const certs =
    d.release_dates?.results.find((r) => r.iso_3166_1 === "US")?.release_dates ??
    d.release_dates?.results[0]?.release_dates ??
    [];
  const cert = certs.map((c) => c.certification).find(Boolean) ?? null;

  return {
    ...base,
    title: mn?.title || base.title,
    originalTitle: mn?.title ? d.title : base.originalTitle,
    description: mn?.overview || base.description,
    tagline: mn?.tagline || d.tagline || "",
    duration: d.runtime || null,
    language: languageName(d.original_language),
    spokenLanguages: d.spoken_languages.map((l) => languageName(l.iso_639_1, l.english_name)),
    ageRating: cert,
    director: d.credits?.crew.find((c) => c.job === "Director")?.name ?? null,
    cast: (d.credits?.cast ?? []).sort((a, b) => a.order - b.order).slice(0, 6).map((c) => c.name),
    trailer: pickTrailer(d.videos?.results),
  };
}

export async function getRelatedMovies(id: number) {
  return (await safeList(`/movie/${id}/recommendations`)).results
    .filter((m) => m.poster)
    .slice(0, 12);
}

export const SORT_OPTIONS: { value: MovieSort; label: string }[] = [
  { value: "popular", label: "Алдартай" },
  { value: "newest", label: "Шинэ" },
  { value: "rating", label: "Өндөр үнэлгээтэй" },
  { value: "title", label: "Нэрээр (A-Z)" },
];

export function isMovieSort(value: string | undefined): value is MovieSort {
  return ["popular", "newest", "rating", "title"].includes(value ?? "");
}
