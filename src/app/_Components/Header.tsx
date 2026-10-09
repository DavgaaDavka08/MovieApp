import Link from "next/link";
import { Film } from "lucide-react";
import { ModeToggle } from "@/components/ui/my-shadchn/theme-toggle";
import { GenreMenu } from "@/components/layout/GenreMenu";
import { SearchBox } from "@/components/layout/SearchBox";
import { MobileSearch } from "@/components/layout/MobileSearch";
import { siteConfig } from "@/config/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="relative mx-auto flex h-[59px] max-w-[1280px] items-center justify-between px-5 lg:px-0">
        <Link href="/" className="flex items-center gap-2 text-indigo-700">
          <Film className="h-5 w-5" />
          <span className="text-base font-bold italic tracking-wide">{siteConfig.name}</span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <GenreMenu />
          <SearchBox className="w-[379px]" />
        </div>

        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <MobileSearch genreMenu={<GenreMenu compact />} />
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
