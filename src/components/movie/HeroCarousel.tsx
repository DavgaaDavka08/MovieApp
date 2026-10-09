"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { Info, PlayCircle, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/types/movie";
import { formatRating } from "@/lib/format";
import { MoviePoster } from "./MoviePoster";
import { WatchFullMovieButton } from "./WatchFullMovieButton";

type Props = {
  movies: (Movie & { genreLabel: string })[];
};

export function HeroCarousel({ movies }: Props) {
  const plugin = React.useRef(Autoplay({ delay: 6000, stopOnInteraction: true }));

  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{ loop: true }}
      className="relative w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="ml-0">
        {movies.map((movie, index) => (
          <CarouselItem key={movie.id} className="relative h-[78vh] min-h-[520px] max-h-[760px] w-full pl-0">
            <MoviePoster
              movie={movie}
              variant="backdrop"
              className="absolute inset-0"
              sizes="100vw"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-[1280px] flex-col gap-3 px-4 pb-12 text-white sm:px-6 sm:pb-16">
              <span className="w-fit rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-widest">
                Онцлох кино
              </span>
              <h1 className="max-w-2xl font-display text-4xl font-bold uppercase leading-none tracking-wide sm:text-6xl">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/80">
                <span className="flex items-center gap-1 font-semibold text-white">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {formatRating(movie.rating)}
                </span>
                {movie.year && <span>{movie.year}</span>}
                <span>·</span>
                <span>{movie.genreLabel}</span>
              </div>
              <p className="line-clamp-3 max-w-xl text-sm leading-6 text-white/85 sm:text-base">
                {movie.description}
              </p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                <WatchFullMovieButton movie={movie} />
                <div className="flex gap-3">
                  <Button asChild size="lg" variant="secondary" className="flex-1 gap-2 sm:flex-none">
                    <Link href={`/movie/${movie.slug}?play=trailer#trailer`}>
                      <PlayCircle className="h-5 w-5" /> Трейлер үзэх
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="flex-1 gap-2 border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:flex-none"
                  >
                    <Link href={`/movie/${movie.slug}`}>
                      <Info className="h-5 w-5" /> Дэлгэрэнгүй
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 hidden border-white/30 bg-black/40 text-white hover:bg-black/60 hover:text-white md:flex" />
      <CarouselNext className="right-4 hidden border-white/30 bg-black/40 text-white hover:bg-black/60 hover:text-white md:flex" />
    </Carousel>
  );
}
