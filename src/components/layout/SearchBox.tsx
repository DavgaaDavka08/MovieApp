"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getPrimaryGenre } from "@/lib/categories";
import type { Movie } from "@/types/movie";
import { MoviePoster } from "@/components/movie/MoviePoster";
import { Rating } from "@/components/movie/Rating";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function SearchBox({
  className,
  onNavigate,
  autoFocus,
}: {
  className?: string;
  onNavigate?: () => void;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  // Бичиж дуусахыг 300мс хүлээгээд серверээс хайна
  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        const data = (await res.json()) as { results: Movie[] };
        setResults(data.results ?? []);
      } catch {
        /* цуцлагдсан */
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [value]);

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
          placeholder="Хайх..."
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full pl-8 shadow-none"
          aria-label="Кино хайх"
        />
      </form>

      {open && value.trim().length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-1 rounded-lg border bg-popover p-3 text-popover-foreground shadow-md sm:left-auto sm:w-[577px]">
          {loading && results.length === 0 ? (
            <p className="p-2 text-sm text-muted-foreground">Хайж байна...</p>
          ) : results.length === 0 ? (
            <p className="p-2 text-sm text-muted-foreground">Илэрц олдсонгүй</p>
          ) : (
            <ul className="flex flex-col">
              {results.slice(0, 5).map((movie) => (
                <li key={movie.id}>
                  <Link
                    href={`/movie/${movie.slug}`}
                    onClick={close}
                    className="flex gap-4 rounded-md p-2 transition hover:bg-accent"
                  >
                    <MoviePoster movie={movie} className="h-[100px] w-[67px] shrink-0 rounded-md" sizes="67px" />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="truncate text-lg font-semibold">{movie.title}</p>
                      <Rating value={movie.rating} />
                      <div className="mt-auto flex items-center justify-between text-sm">
                        <span>{[movie.year, getPrimaryGenre(movie)].filter(Boolean).join(" · ")}</span>
                        <span className="flex items-center gap-1 font-medium">
                          Дэлгэрэнгүй <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                  <Separator className="my-2" />
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`/movies?q=${encodeURIComponent(value.trim())}`}
            onClick={close}
            className="block px-2 py-2 text-sm font-medium hover:underline"
          >
            &ldquo;{value}&rdquo; — бүх илэрцийг харах
          </Link>
        </div>
      )}
    </div>
  );
}
