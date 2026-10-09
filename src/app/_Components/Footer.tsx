import Link from "next/link";
import { Film, Mail, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 w-full bg-indigo-700 px-5 py-10 text-white lg:px-0">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col justify-between gap-7 text-sm lg:flex-row">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5" />
            <p className="text-base font-bold italic">{siteConfig.name}</p>
          </div>
          <p>© {year} {siteConfig.name}. Бүх эрх хуулиар хамгаалагдсан.</p>
          <p className="max-w-sm text-xs text-white/70">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>

        <div className="flex gap-12 lg:gap-24">
          <div className="flex flex-col gap-3">
            <p className="font-medium">Холбоо барих</p>
            <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-3">
              <Mail className="h-4 w-4" />
              <span>
                <span className="block font-medium">Имэйл:</span>
                {siteConfig.contact.email}
              </span>
            </a>
            <a href={`tel:${siteConfig.contact.phone.replace(/\s|-/g, "")}`} className="flex items-center gap-3">
              <Phone className="h-4 w-4" />
              <span>
                <span className="block font-medium">Утас:</span>
                {siteConfig.contact.phone}
              </span>
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-medium">Биднийг дагаарай</p>
            {siteConfig.social.map((s) => (
              <Link key={s.name} href={s.href} target="_blank" rel="noreferrer" className="hover:underline">
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
