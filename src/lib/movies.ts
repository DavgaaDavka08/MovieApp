import { categories } from "@/data/categories";
import { sampleMovies } from "@/data/sample-movies";
import type { Category, CategorySlug, Movie, MovieSort } from "@/types/movie";

/**
 * Өгөгдөлд хандах давхарга. Phase 2-т эдгээр функцийн дотор талыг
 * өгөгдлийн сангийн query-ээр солиход UI компонентуудыг өөрчлөх шаардлагагүй.
 */

export function getAllMovies(): Movie[] {
  return sampleMovies;
}

export function getMovieBySlug(slug: string): Movie | undefined {
  return sampleMovies.find((m) => m.slug === slug);
}

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryName(slug: CategorySlug): string {
  return getCategory(slug)?.name ?? slug;
}

/** Картанд харуулах үндсэн төрөл (улсын ангиллаас бусад эхний төрөл) */
export function getPrimaryGenre(movie: Movie): string {
  const genre = movie.categories.find((c) => getCategory(c)?.kind === "genre");
  return getCategoryName(genre ?? movie.categories[0]);
}

export function getMoviesByCategory(slug: CategorySlug): Movie[] {
  return sortMovies(
    sampleMovies.filter((m) => m.categories.includes(slug)),
    "popular"
  );
}

export function getFeaturedMovies(): Movie[] {
  return sortMovies(sampleMovies.filter((m) => m.featured), "popular");
}

export function getTrendingMovies(): Movie[] {
  return sortMovies(sampleMovies.filter((m) => m.trending), "popular");
}

export function getPopularMovies(limit = 10): Movie[] {
  return sortMovies(sampleMovies, "popular").slice(0, limit);
}

export function getRecentlyAdded(limit = 10): Movie[] {
  return sortMovies(sampleMovies, "newest").slice(0, limit);
}

export function getRelatedMovies(movie: Movie, limit = 6): Movie[] {
  return sortMovies(
    sampleMovies.filter(
      (m) =>
        m.id !== movie.id && m.categories.some((c) => movie.categories.includes(c))
    ),
    "popular"
  ).slice(0, limit);
}

export function sortMovies(list: Movie[], sort: MovieSort): Movie[] {
  const copy = [...list];
  switch (sort) {
    case "newest":
      return copy.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    case "year":
      return copy.sort((a, b) => b.year - a.year);
    case "title":
      return copy.sort((a, b) => a.title.localeCompare(b.title, "mn"));
    case "price":
      return copy.sort((a, b) => a.price - b.price);
    case "popular":
    default:
      return copy.sort((a, b) => b.popularity - a.popularity);
  }
}

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFC").trim();
}

/** Нэр, эх нэр, ангилал, түлхүүр үг, найруулагч, жүжигчдээр хайна */
export function searchMovies(query: string, list: Movie[] = sampleMovies): Movie[] {
  const q = normalize(query);
  if (!q) return list;
  const terms = q.split(/\s+/);
  return list.filter((movie) => {
    const haystack = normalize(
      [
        movie.title,
        movie.originalTitle ?? "",
        movie.tagline,
        movie.director,
        movie.year.toString(),
        ...movie.cast,
        ...movie.keywords,
        ...movie.categories,
        ...movie.categories.map(getCategoryName),
      ].join(" ")
    );
    return terms.every((t) => haystack.includes(t));
  });
}

export const SORT_OPTIONS: { value: MovieSort; label: string }[] = [
  { value: "popular", label: "Алдартай" },
  { value: "newest", label: "Шинээр нэмэгдсэн" },
  { value: "year", label: "Гарсан он" },
  { value: "title", label: "Нэрээр (А-Я)" },
];

export function isMovieSort(value: string | undefined): value is MovieSort {
  return ["popular", "newest", "year", "title", "price"].includes(value ?? "");
}
