"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Film, Play, RotateCcw } from "lucide-react";
import type { MovieDetail } from "@/types/movie";
import { MoviePoster } from "./MoviePoster";
import { WatchFullMovieButton } from "./WatchFullMovieButton";

type Props = {
  movie: MovieDetail;
  /** ?play=trailer линкээр орж ирвэл шууд тоглуулна */
  autoStart?: boolean;
};

type State = "idle" | "playing" | "ended" | "error";

/* ---- YouTube IFrame API-ийн хамгийн бага төрөл ---- */
type YTPlayer = { destroy(): void; playVideo(): void; seekTo(s: number): void };
type YTNamespace = {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      playerVars?: Record<string, number | string>;
      events?: {
        onStateChange?: (e: { data: number }) => void;
        onError?: () => void;
      };
    }
  ) => YTPlayer;
};
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytPromise: Promise<YTNamespace> | null = null;
function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (ytPromise) return ytPromise;
  ytPromise = new Promise((resolve, reject) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      if (window.YT) resolve(window.YT);
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    s.onerror = () => {
      ytPromise = null;
      reject(new Error("YouTube API ачаалагдсангүй"));
    };
    document.head.appendChild(s);
  });
  return ytPromise;
}

export function TrailerPlayer({ movie, autoStart = false }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [state, setState] = useState<State>(autoStart && movie.trailer ? "playing" : "idle");
  const trailerKey = movie.trailer?.key;

  useEffect(() => {
    if (state !== "playing" || !trailerKey || playerRef.current) return;
    let cancelled = false;
    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !mountRef.current) return;
        const el = document.createElement("div");
        mountRef.current.replaceChildren(el);
        playerRef.current = new YT.Player(el, {
          videoId: trailerKey,
          playerVars: { autoplay: 1, playsinline: 1, rel: 0, modestbranding: 1 },
          events: {
            // 0 = дууссан
            onStateChange: (e) => {
              if (e.data === 0) setState("ended");
            },
            onError: () => setState("error"),
          },
        });
      })
      .catch(() => setState("error"));
    return () => {
      cancelled = true;
    };
  }, [state, trailerKey]);

  useEffect(
    () => () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    },
    []
  );

  const replay = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.playVideo();
    }
    setState("playing");
  }, []);

  if (!movie.trailer) {
    return (
      <div className="relative flex aspect-video w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-xl bg-secondary text-center">
        <MoviePoster movie={movie} variant="backdrop" className="absolute inset-0 opacity-30" sizes="900px" />
        <Film className="relative h-10 w-10 text-muted-foreground" />
        <p className="relative font-semibold">Энэ киноны трейлер одоогоор байхгүй байна</p>
      </div>
    );
  }

  return (
    <div
      id="trailer"
      className="relative aspect-video w-full scroll-mt-24 overflow-hidden rounded-xl bg-black"
    >
      {/* YouTube тоглуулагч энд үүснэ */}
      <div
        ref={mountRef}
        className="absolute inset-0 [&>iframe]:h-full [&>iframe]:w-full"
        hidden={state === "idle"}
      />

      {state === "idle" && (
        <button
          type="button"
          onClick={() => setState("playing")}
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
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/90 p-6 text-center text-white">
          <p className="font-display text-2xl font-semibold sm:text-3xl">Киног бүтнээр нь үзэх үү?</p>
          {movie.tagline && <p className="max-w-md text-sm text-white/70">{movie.tagline}</p>}
          <WatchFullMovieButton movie={movie} />
          <button
            type="button"
            onClick={replay}
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
          <a
            href={`https://www.youtube.com/watch?v=${movie.trailer.key}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-white/30 px-4 py-2 text-sm hover:bg-white/10"
          >
            YouTube дээр үзэх
          </a>
        </div>
      )}
    </div>
  );
}
