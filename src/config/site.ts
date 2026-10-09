export const siteConfig = {
  name: "Movie Z",
  description:
    "Монгол болон дэлхийн шилдэг кинонуудыг трейлерээр нь үнэгүй үзэж, хүссэн киногоо нэг удаагийн төлбөрөөр бүтнээр нь үзээрэй.",
  /** Production домэйн. Facebook-д хуваалцах линкүүд үүнийг ашиглана. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contact: {
    email: "support@moviez.mn",
    phone: "+976 7700-0000",
  },
  social: [
    { name: "Facebook", href: "https://www.facebook.com/" },
    { name: "Instagram", href: "https://www.instagram.com/" },
    { name: "YouTube", href: "https://www.youtube.com/" },
  ],
};

export const mainNav = [
  { label: "Нүүр", href: "/" },
  { label: "Бүх кино", href: "/movies" },
  { label: "Алдартай", href: "/movies?sort=popular" },
  { label: "Шинэ", href: "/movies?sort=newest" },
];
