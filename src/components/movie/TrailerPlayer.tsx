"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import type { Movie } from "@/types/movie";
import { MoviePoster } from "./MoviePoster";
import { WatchFullMovieButton } from "./WatchFullMovieButton";

type Props = {
  movie: Movie;
  /** ?play=trailer линкээр орж ирвэл шууд тоглуулна */
  autoStart?: boolean;
};

type State = "idle" | "playing" | "ended" | "error";

export function TrailerPlayer({ movie, autoStart = false }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<State>(autoStart ? "playing" : "idle");

  useEffect(() => {
    if (state !== "playing") return;
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      // Автоматаар тоглуулахыг хөтөч хориглосон бол дуугүй тоглуулна
      v.muted = true;
      v.play().catch(() => undefined);
    });
  }, [state]);

  const start = () => {
    if (videoRef.current) videoRef.current.currentTime = 0;
    setState("playing");
  };

  return (
    <div
      id="trailer"
      className="relative aspect-video w-full scroll-mt-24 overflow-hidden rounded-xl bg-black"
    >
      {state !== "idle" && (
        <video
          ref={videoRef}
          className="h-full w-full"
          controls={state === "playing"}
          playsInline
          preload="metadata"
          poster={movie.backdrop}
          onEnded={() => setState("ended")}
          onError={() => setState("error")}
        >
          <source src={movie.trailer.src} type={movie.trailer.type} />
        </video>
      )}

      {state === "idle" && (
        <button
          type="button"
          onClick={start}
          className="group absolute inset-0 text-left"
          aria-label={`${movie.title} трейлер тоглуулах`}
        >
          <MoviePoster movie={movie} variant="backdrop" className="absolute inset-0" sizes="(max-width: 1024px) 100vw, 900px" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40 transition group-hover:scale-110 sm:h-20 sm:w-20">
              <Play className="ml-1 h-8 w-8 fill-white" />
            </span>
            <span className="text-sm font-semibold sm:text-base">Трейлер үзэх · Үнэгүй</span>
          </span>
        </button>
      )}

      {state === "ended" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/85 p-6 text-center text-white">
          <p className="font-display text-2xl font-semibold sm:text-3xl">Киног бүтнээр нь үзэх үү?</p>
          <p className="max-w-md text-sm text-white/70">{movie.tagline}</p>
          <WatchFullMovieButton movie={movie} />
          <button
            type="button"
            onClick={start}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" /> Трейлерийг дахин үзэх
          </button>
        </div>
      )}

      {state === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/90 p-6 text-center text-white">
          <p className="font-semibold">Трейлер ачаалж чадсангүй</p>
          <p className="text-sm text-white/60">Интернет холболтоо шалгаад дахин оролдоно уу.</p>
          <button
            type="button"
            onClick={() => {
              setState("idle");
            }}
            className="rounded-md border border-white/30 px-4 py-2 text-sm hover:bg-white/10"
          >
            Дахин оролдох
          </button>
        </div>
      )}

      {state === "playing" && (
        <span className="pointer-events-none absolute left-3 top-3 rounded bg-black/60 px-2 py-1 text-[11px] text-white/80">
          Трейлер · {movie.trailer.credit}
        </span>
      )}
    </div>
  );
}
