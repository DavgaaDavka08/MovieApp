export type CategorySlug =
  | "action"
  | "adventure"
  | "comedy"
  | "drama"
  | "romance"
  | "horror"
  | "thriller"
  | "crime"
  | "scifi"
  | "fantasy"
  | "animation"
  | "family"
  | "documentary"
  | "mongolian"
  | "korean"
  | "chinese"
  | "japanese";

export type Category = {
  slug: CategorySlug;
  name: string;
  /** Төрөл (genre) эсвэл улс/хэлний ангилал */
  kind: "genre" | "region";
  /** TMDB дээрх харгалзах шүүлтүүр */
  tmdb: { genreId?: number; language?: string };
};

/** Жагсаалт, картанд хэрэглэгдэх киноны үндсэн мэдээлэл */
export type Movie = {
  id: number;
  /** Facebook-д хуваалцах давтагдашгүй URL: /movie/[slug] (жишээ нь 550-fight-club) */
  slug: string;
  title: string;
  originalTitle?: string;
  description: string;
  year: number | null;
  releaseDate: string | null;
  /** Төгрөгөөр. Үндсэн үнэ 10,000₮ */
  price: number;
  categories: CategorySlug[];
  rating: number;
  voteCount: number;
  popularity: number;
  poster?: string;
  backdrop?: string;
  /** Зураг байхгүй үед постер үүсгэх өнгө */
  palette: [string, string];
};

export type Trailer = {
  provider: "youtube";
  key: string;
  name: string;
};

/** Киноны дэлгэрэнгүй хуудсанд хэрэглэгдэх бүрэн мэдээлэл */
export type MovieDetail = Movie & {
  tagline: string;
  /** минутаар */
  duration: number | null;
  language: string;
  spokenLanguages: string[];
  ageRating: string | null;
  director: string | null;
  cast: string[];
  trailer: Trailer | null;
};

export type MovieSort = "popular" | "newest" | "rating" | "title";

export type Paged<T> = {
  results: T[];
  page: number;
  totalPages: number;
  totalResults: number;
};
