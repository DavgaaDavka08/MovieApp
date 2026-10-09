"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { MovieDetail } from "@/types/movie";
import { cn } from "@/lib/utils";
import { MoviePoster } from "./MoviePoster";
import { Rating } from "./Rating";
import { TrailerDialog } from "./TrailerDialog";

export function HeroCarousel({ movies }: { movies: MovieDetail[] }) {
  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      plugins={[plugin.current]}
      opts={{ loop: true }}
      className="relative w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="ml-0">
        {movies.map((movie, index) => (
          <CarouselItem key={movie.id} className="pl-0">
            <div className="relative">
              <Link href={`/movie/${movie.slug}`} aria-label={movie.title}>
                <MoviePoster
                  movie={movie}
                  variant="backdrop"
                  className="h-[246px] w-full sm:h-[420px] lg:h-[600px]"
                  sizes="100vw"
                  priority={index === 0}
                />
              </Link>

              {/* Desktop: зураг дээр бичвэр */}
              <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-black/60 via-black/20 to-transparent lg:block" />
              <div className="absolute inset-y-0 left-0 hidden w-full max-w-[1280px] lg:left-1/2 lg:flex lg:-translate-x-1/2 lg:items-center">
                <HeroText movie={movie} overlay className="w-[404px] text-white" />
              </div>
            </div>

            {/* Гар утас: зурагны доор бичвэр */}
            <HeroText movie={movie} className="px-5 py-5 lg:hidden" />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-11 top-[300px] hidden lg:flex" />
      <CarouselNext className="right-11 top-[300px] hidden lg:flex" />

      <div className="absolute left-1/2 top-[220px] flex -translate-x-1/2 gap-2 sm:top-[392px] lg:top-[565px]">
        {movies.map((m, i) => (
          <button
            key={m.id}
            type="button"
            aria-label={`${i + 1}-р слайд`}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              "h-2 w-2 rounded-full transition",
              current === i ? "bg-white" : "bg-white/40"
            )}
          />
        ))}
      </div>
    </Carousel>
  );
}

function HeroText({
  movie,
  overlay = false,
  className,
}: {
  movie: MovieDetail;
  overlay?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-start justify-between gap-4 lg:flex-col lg:gap-1">
        <div>
          <p className="text-sm lg:text-base">Одоо гарч буй:</p>
          <h2 className="text-2xl font-semibold lg:text-4xl lg:font-bold">{movie.title}</h2>
        </div>
        <Rating value={movie.rating} className={overlay ? "text-lg [&_span:last-child]:text-white/60" : ""} />
      </div>
      <p className="line-clamp-5 text-sm leading-5 lg:text-xs lg:leading-5">{movie.description}</p>
      {movie.trailer && (
        <div>
          <TrailerDialog
            title={movie.title}
            trailerKey={movie.trailer.key}
            variant={overlay ? "secondary" : "default"}
          />
        </div>
      )}
    </div>
  );
}
