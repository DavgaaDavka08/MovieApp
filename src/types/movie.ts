export type CategorySlug =
  | "action"
  | "comedy"
  | "drama"
  | "romance"
  | "horror"
  | "thriller"
  | "animation"
  | "family"
  | "mongolian"
  | "chinese"
  | "korean"
  | "international";

export type Category = {
  slug: CategorySlug;
  name: string;
  /** Төрөл (genre) эсвэл улс/хэлний ангилал */
  kind: "genre" | "region";
};

export type Movie = {
  id: string;
  /** Facebook болон бусад сувгаар хуваалцах давтагдашгүй URL: /movie/[slug] */
  slug: string;
  title: string;
  originalTitle?: string;
  tagline: string;
  description: string;
  synopsis: string;
  year: number;
  /** Минутаар */
  duration: number;
  /** Төгрөгөөр. Үндсэн үнэ 10,000₮ */
  price: number;
  categories: CategorySlug[];
  language: string;
  subtitles: string[];
  ageRating: string;
  rating: number;
  director: string;
  cast: string[];
  keywords: string[];
  /** Босоо постер. Байхгүй бол автоматаар үүсгэсэн постер харагдана */
  poster?: string;
  /** Хэвтээ баннер */
  backdrop?: string;
  /** Постер үүсгэх өнгө [эхлэл, төгсгөл] */
  palette: [string, string];
  trailer: {
    src: string;
    type: "video/mp4";
    /** Трейлерийн эх сурвалж, лиценз */
    credit: string;
  };
  addedAt: string;
  popularity: number;
  featured?: boolean;
  trending?: boolean;
  /** Жишээ өгөгдөл эсэх. Бодит каталог холбогдоход false болно */
  isSample: boolean;
};

export type MovieSort = "popular" | "newest" | "year" | "title" | "price";
