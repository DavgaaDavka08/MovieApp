"use client";

import Image from "next/image";
import { useState } from "react";
import { Film } from "lucide-react";
import type { Movie } from "@/types/movie";
import { cn } from "@/lib/utils";

type Props = {
  movie: Pick<Movie, "title" | "poster" | "backdrop">;
  variant?: "poster" | "backdrop";
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** Постер / баннер зураг. Зураг байхгүй бол саарал орлуулагч харуулна. */
export function MoviePoster({
  movie,
  variant = "poster",
  className,
  sizes = "(max-width: 640px) 50vw, 230px",
  priority,
}: Props) {
  const src = variant === "poster" ? movie.poster : movie.backdrop ?? movie.poster;
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
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
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center text-muted-foreground">
          <Film className="h-8 w-8" />
          <span className="line-clamp-2 text-sm font-medium">{movie.title}</span>
        </div>
      )}
    </div>
  );
}
