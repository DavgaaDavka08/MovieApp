"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, SearchIcon, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getPrimaryGenre, searchMovies } from "@/lib/movies";
import { formatPrice, formatRating } from "@/lib/format";
import { MoviePoster } from "@/components/movie/MoviePoster";
import { cn } from "@/lib/utils";

export function SearchBox({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => (value.trim() ? searchMovies(value).slice(0, 5) : []), [value]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const close = () => {
    setOpen(false);
    setValue("");
    onNavigate?.();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/movies?q=${encodeURIComponent(q)}` : "/movies");
    close();
  };

  return (
    <div ref={wrapRef} className={cn("relative w-full", className)}>
      <form onSubmit={submit} role="search">
        <SearchIcon className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Кино, төрөл, жүжигчин хайх..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full rounded-lg bg-secondary pl-8"
          aria-label="Кино хайх"
        />
      </form>

      {open && value.trim().length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-lg border bg-popover shadow-xl sm:left-auto sm:w-[460px]">
          {results.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              &ldquo;{value}&rdquo; илэрц олдсонгүй
            </p>
          ) : (
            <ul className="flex flex-col divide-y">
              {results.map((movie) => (
                <li key={movie.id}>
                  <Link
                    href={`/movie/${movie.slug}`}
                    onClick={close}
                    className="flex items-center gap-3 p-3 transition hover:bg-accent"
                  >
                    <MoviePoster movie={movie} className="h-[72px] w-12 shrink-0 rounded" sizes="48px" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{movie.title}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {formatRating(movie.rating)} · {movie.year} · {getPrimaryGenre(movie)}
                      </p>
                      <p className="text-xs font-semibold text-primary">{formatPrice(movie.price)}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`/movies?q=${encodeURIComponent(value.trim())}`}
            onClick={close}
            className="block border-t bg-secondary/50 p-3 text-sm font-medium hover:bg-accent"
          >
            &ldquo;{value}&rdquo; — бүх илэрцийг харах
          </Link>
        </div>
      )}
    </div>
  );
}
