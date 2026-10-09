"use client";

import Image from "next/image";
import { useState } from "react";
import type { Movie } from "@/types/movie";
import { cn } from "@/lib/utils";

type Props = {
  movie: Movie;
  variant?: "poster" | "backdrop";
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Постер / баннер зураг. Зураг байхгүй эсвэл ачаалж чадахгүй бол
 * киноны өнгөөр үүсгэсэн постер харуулна.
 */
export function MoviePoster({
  movie,
  variant = "poster",
  className,
  sizes = "(max-width: 640px) 45vw, 220px",
  priority,
}: Props) {
  const src = variant === "poster" ? movie.poster : movie.backdrop ?? movie.poster;
  const [failed, setFailed] = useState(false);
  const [from, to] = movie.palette;

  return (
    <div
      className={cn("relative overflow-hidden bg-secondary", className)}
      style={{ backgroundImage: `linear-gradient(160deg, ${from} 0%, ${to} 100%)` }}
    >
      {src && !failed ? (
        <Image
          src={src}
          alt={movie.title}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
          {variant === "poster" && (
            <>
              {movie.year && (
                <span className="relative text-[10px] uppercase tracking-[0.3em] text-white/60">
                  {movie.year}
                </span>
              )}
              <span className="relative font-display text-2xl font-semibold uppercase leading-tight tracking-wide">
                {movie.title}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
