import type { Category } from "@/types/movie";

/**
 * Ангиллын жагсаалт. TMDB-ийн genre id / хэлний кодтой холбогдсон.
 * Phase 2-т админ самбараас удирдагдана.
 */
export const categories: Category[] = [
  { slug: "action", name: "Тулаант", kind: "genre", tmdb: { genreId: 28 } },
  { slug: "adventure", name: "Адал явдалт", kind: "genre", tmdb: { genreId: 12 } },
  { slug: "comedy", name: "Инээдмийн", kind: "genre", tmdb: { genreId: 35 } },
  { slug: "drama", name: "Драм", kind: "genre", tmdb: { genreId: 18 } },
  { slug: "romance", name: "Романтик", kind: "genre", tmdb: { genreId: 10749 } },
  { slug: "horror", name: "Аймшгийн", kind: "genre", tmdb: { genreId: 27 } },
  { slug: "thriller", name: "Триллер", kind: "genre", tmdb: { genreId: 53 } },
  { slug: "crime", name: "Гэмт хэргийн", kind: "genre", tmdb: { genreId: 80 } },
  { slug: "scifi", name: "Шинжлэх ухааны уран зөгнөлт", kind: "genre", tmdb: { genreId: 878 } },
  { slug: "fantasy", name: "Уран зөгнөлт", kind: "genre", tmdb: { genreId: 14 } },
  { slug: "animation", name: "Хүүхэлдэйн", kind: "genre", tmdb: { genreId: 16 } },
  { slug: "family", name: "Гэр бүлийн", kind: "genre", tmdb: { genreId: 10751 } },
  { slug: "documentary", name: "Баримтат", kind: "genre", tmdb: { genreId: 99 } },
  { slug: "mongolian", name: "Монгол кино", kind: "region", tmdb: { language: "mn" } },
  { slug: "korean", name: "Солонгос кино", kind: "region", tmdb: { language: "ko" } },
  { slug: "chinese", name: "Хятад кино", kind: "region", tmdb: { language: "zh" } },
  { slug: "japanese", name: "Япон кино", kind: "region", tmdb: { language: "ja" } },
];
