/**
 * TMDB (The Movie Database) API-тай харьцах давхарга. Зөвхөн сервер талд ашиглана.
 * Токеныг `.env.local` файлын TMDB_TOKEN хувьсагчид хадгална. Кодонд бүү бич.
 */

const API = process.env.TMDB_API_BASE ?? "https://api.themoviedb.org/3";
export const IMG = process.env.TMDB_IMAGE_BASE ?? "https://image.tmdb.org/t/p";

/** Жагсаалтын хуудсыг 1 цаг кэшлэнэ */
const REVALIDATE_SECONDS = 60 * 60;

export type TmdbListMovie = {
  id: number;
  title: string;
  original_title?: string;
  original_language?: string;
  overview: string;
  release_date?: string;
  genre_ids?: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  poster_path: string | null;
  backdrop_path: string | null;
};

export type TmdbList = {
  page: number;
  results: TmdbListMovie[];
  total_pages: number;
  total_results: number;
};

export type TmdbVideo = {
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  iso_639_1: string;
  published_at: string;
};

export type TmdbDetail = Omit<TmdbListMovie, "genre_ids"> & {
  genres: { id: number; name: string }[];
  runtime: number | null;
  tagline: string;
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  videos?: { results: TmdbVideo[] };
  credits?: {
    cast: { name: string; order: number }[];
    crew: { name: string; job: string }[];
  };
  translations?: {
    translations: {
      iso_639_1: string;
      data: { title?: string; overview?: string; tagline?: string };
    }[];
  };
  release_dates?: {
    results: { iso_3166_1: string; release_dates: { certification: string }[] }[];
  };
};

export class TmdbError extends Error {}

export async function tmdb<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  revalidate = REVALIDATE_SECONDS
): Promise<T> {
  const token = process.env.TMDB_TOKEN;
  if (!token) {
    throw new TmdbError("TMDB_TOKEN тохируулаагүй байна. .env.local файлд нэмнэ үү.");
  }
  const url = new URL(`${API}${path}`);
  for (const [k, v] of Object.entries({ language: "en-US", ...params })) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    next: { revalidate },
  });
  if (res.status === 404) throw new TmdbError("not_found");
  if (!res.ok) throw new TmdbError(`TMDB ${res.status}: ${path}`);
  return (await res.json()) as T;
}
