import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getAllCategories } from "@/lib/categories";

export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 w-full bg-[#7f0d12] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto grid w-full max-w-[1280px] gap-8 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Image src="/film.svg" alt="" width={24} height={24} />
            <p className="font-display text-lg font-semibold uppercase italic">{siteConfig.name}</p>
          </div>
          <p className="text-white/75">{siteConfig.description}</p>
          <p className="mt-2 text-white/60">© {year} {siteConfig.name}. Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-semibold">Кино</p>
          <Link href="/movies" className="text-white/75 hover:text-white">Бүх кино</Link>
          <Link href="/movies?sort=popular" className="text-white/75 hover:text-white">Алдартай</Link>
          <Link href="/movies?sort=newest" className="text-white/75 hover:text-white">Шинээр нэмэгдсэн</Link>
          {getAllCategories()
            .filter((c) => c.kind === "region")
            .slice(0, 3)
            .map((c) => (
              <Link key={c.slug} href={`/movies?category=${c.slug}`} className="text-white/75 hover:text-white">
                {c.name}
              </Link>
            ))}
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-semibold">Холбоо барих</p>
          <div className="flex items-center gap-2">
            <Image src="/mail.svg" alt="" width={18} height={18} />
            <a href={`mailto:${siteConfig.contact.email}`} className="text-white/75 hover:text-white">
              {siteConfig.contact.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/phone.svg" alt="" width={18} height={18} />
            <a href={`tel:${siteConfig.contact.phone.replace(/\s|-/g, "")}`} className="text-white/75 hover:text-white">
              {siteConfig.contact.phone}
            </a>
          </div>
          <p className="text-xs text-white/60">
            Зохиогчийн эрхийн гомдол: {siteConfig.contact.email}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-semibold">Биднийг дагаарай</p>
          {siteConfig.social.map((s) => (
            <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="text-white/75 hover:text-white">
              {s.name}
            </a>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-[1280px] border-t border-white/15 pt-4 text-xs text-white/50">
        Киноны мэдээлэл, зургийг TMDB-ээс авсан. This product uses the TMDB API but is not endorsed or
        certified by TMDB. Трейлерүүд YouTube-ээр тоглогдоно. Бүтэн киног зөвхөн түгээх эрх бүхий
        контентоор нийтэлнэ.
      </p>
    </footer>
  );
};
