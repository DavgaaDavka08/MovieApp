import type { Category } from "@/types/movie";

/**
 * Ангиллын жагсаалт. Phase 2-т админ самбараас удирдагдах тул
 * UI компонентуудаас тусад нь хадгална.
 */
export const categories: Category[] = [
  { slug: "action", name: "Тулаант", kind: "genre" },
  { slug: "comedy", name: "Инээдмийн", kind: "genre" },
  { slug: "drama", name: "Драм", kind: "genre" },
  { slug: "romance", name: "Романтик", kind: "genre" },
  { slug: "horror", name: "Аймшгийн", kind: "genre" },
  { slug: "thriller", name: "Триллер", kind: "genre" },
  { slug: "animation", name: "Хүүхэлдэйн", kind: "genre" },
  { slug: "family", name: "Гэр бүлийн", kind: "genre" },
  { slug: "mongolian", name: "Монгол кино", kind: "region" },
  { slug: "korean", name: "Солонгос кино", kind: "region" },
  { slug: "chinese", name: "Хятад кино", kind: "region" },
  { slug: "international", name: "Гадаад кино", kind: "region" },
];
