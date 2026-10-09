"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/config/site";
import { getAllCategories } from "@/lib/movies";
import { SearchBox } from "./SearchBox";
import { LoginButton } from "./LoginButton";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Цэс хаах" : "Цэс нээх"}
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t bg-background px-4 pb-10 pt-4">
          <SearchBox onNavigate={() => setOpen(false)} />
          <nav className="mt-6 flex flex-col">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b py-3 text-lg font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="mb-3 mt-6 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Ангилал
          </p>
          <div className="grid grid-cols-2 gap-2">
            {getAllCategories().map((c) => (
              <Link
                key={c.slug}
                href={`/movies?category=${c.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-lg bg-secondary px-3 py-3 text-sm font-medium"
              >
                {c.name}
              </Link>
            ))}
          </div>
          <LoginButton className="mt-6 w-full" />
        </div>
      )}
    </div>
  );
}
