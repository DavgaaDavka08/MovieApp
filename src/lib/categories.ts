import { categories } from "@/data/categories";
import type { Category, CategorySlug, Movie } from "@/types/movie";

/** Клиент болон сервер аль алинд нь ашиглаж болох ангиллын туслах функцууд */

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategory(slug: string | undefined): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryName(slug: CategorySlug): string {
  return getCategory(slug)?.name ?? slug;
}

export function categoriesFromTmdb(genreIds: number[], language?: string): CategorySlug[] {
  const out: CategorySlug[] = [];
  for (const c of categories) {
    if (c.tmdb.genreId && genreIds.includes(c.tmdb.genreId)) out.push(c.slug);
  }
  for (const c of categories) {
    if (c.tmdb.language && c.tmdb.language === language) out.push(c.slug);
  }
  return out;
}

/** Картанд харуулах үндсэн төрөл */
export function getPrimaryGenre(movie: Pick<Movie, "categories">): string {
  const genre = movie.categories.find((c) => getCategory(c)?.kind === "genre");
  const slug = genre ?? movie.categories[0];
  return slug ? getCategoryName(slug) : "Кино";
}
