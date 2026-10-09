import { Film } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/my-shadchn/theme-toggle";
import { CategoryMenu } from "@/components/layout/CategoryMenu";
import { SearchBox } from "@/components/layout/SearchBox";
import { LoginButton } from "@/components/layout/LoginButton";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { mainNav, siteConfig } from "@/config/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Film className="h-5 w-5 text-primary" />
            <span className="font-display text-xl font-bold uppercase italic tracking-wide text-primary">
              {siteConfig.name}
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-medium text-muted-foreground lg:flex">
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden flex-1 items-center justify-end gap-3 lg:flex">
          <CategoryMenu />
          <SearchBox className="max-w-[300px]" />
          <LoginButton />
          <ModeToggle />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ModeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
