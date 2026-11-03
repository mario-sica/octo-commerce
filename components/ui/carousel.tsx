"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Shared carousel primitive (shadcn `carousel` on Embla). Both best-sellers carousels build on it;
 * the controls — dots from `lg` and the arrow pair — sit in one row below the slides.
 */

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  snapCount: number;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );

  // Read Embla's state as an external store, so it updates on its own events.
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      if (!api) return () => {};
      api.on("select", onChange).on("reInit", onChange);
      return () => {
        api.off("select", onChange).off("reInit", onChange);
      };
    },
    [api],
  );
  const canScrollPrev = React.useSyncExternalStore(
    subscribe,
    () => api?.canScrollPrev() ?? false,
    () => false,
  );
  const canScrollNext = React.useSyncExternalStore(
    subscribe,
    () => api?.canScrollNext() ?? false,
    () => false,
  );
  const selectedIndex = React.useSyncExternalStore(
    subscribe,
    () => api?.selectedScrollSnap() ?? 0,
    () => 0,
  );
  const snapCount = React.useSyncExternalStore(
    subscribe,
    () => api?.scrollSnapList().length ?? 0,
    () => 0,
  );

  // Embla animates in JavaScript, so CSS can't stop it: jump instead when motion is reduced.
  const reduceMotion = usePrefersReducedMotion();

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev(reduceMotion);
  }, [api, reduceMotion]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext(reduceMotion);
  }, [api, reduceMotion]);

  const scrollTo = React.useCallback(
    (index: number) => {
      api?.scrollTo(index, reduceMotion);
    },
    [api, reduceMotion],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        scrollTo,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        snapCount,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

type CarouselContentProps = React.ComponentProps<"div"> & {
  /** Classes for the Embla viewport, e.g. `overflow-visible` to let slides peek past it. */
  viewportClassName?: string;
};

/** The slide track. Slides are spaced by `gap-cards` (negative margin + slide padding). */
function CarouselContent({
  className,
  viewportClassName,
  ...props
}: CarouselContentProps) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className={cn("overflow-hidden", viewportClassName)}
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-cards" : "-mt-cards flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-cards" : "pt-cards",
        className,
      )}
      {...props}
    />
  );
}

/** Previous-slide arrow; disabled at the start. */
function CarouselPrevious({
  className,
  variant = "special",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn("touch-manipulation", className)}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      aria-label="Previous slide"
      {...props}
    >
      <ChevronLeft size={24} aria-hidden="true" />
    </Button>
  );
}

/** Next-slide arrow; disabled at the end. */
function CarouselNext({
  className,
  variant = "special",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn("touch-manipulation", className)}
      disabled={!canScrollNext}
      onClick={scrollNext}
      aria-label="Next slide"
      {...props}
    >
      <ChevronRight size={24} aria-hidden="true" />
    </Button>
  );
}

/**
 * Pagination dots, one per scroll snap, shown from `lg` (spec, Assumption 2). Each 6 px dot sits
 * in a 24 px button so the touch target stays usable.
 */
function CarouselDots({ className, ...props }: React.ComponentProps<"div">) {
  const { snapCount, selectedIndex, scrollTo } = useCarousel();
  if (snapCount < 2) return null;

  return (
    <div
      data-slot="carousel-dots"
      className={cn("hidden items-center lg:flex", className)}
      {...props}
    >
      {Array.from({ length: snapCount }, (_, index) => {
        const current = index === selectedIndex;
        return (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={current ? "true" : undefined}
            onClick={() => scrollTo(index)}
            className="group flex size-6 items-center justify-center rounded-full"
          >
            {/* Inactive dots meet 3:1 against the page (WCAG 1.4.11); the current one is
                also wider, so it differs by shape as well as colour. */}
            <span
              aria-hidden="true"
              className={cn(
                "h-1.5 rounded-full transition-all motion-reduce:transition-none",
                current
                  ? "w-4 bg-foreground"
                  : "w-1.5 bg-muted-foreground group-hover:bg-foreground",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

/**
 * The row below the slides: dots on the left (from `lg`), the arrow pair bottom-right.
 * `dots={false}` keeps only the arrows (the PDP carousel references show none).
 */
function CarouselControls({
  className,
  dots = true,
  ...props
}: React.ComponentProps<"div"> & { dots?: boolean }) {
  return (
    <div
      data-slot="carousel-controls"
      className={cn("flex items-center justify-between gap-4", className)}
      {...props}
    >
      {dots && <CarouselDots />}
      <div className="ml-auto flex items-center gap-2">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </div>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  CarouselControls,
  useCarousel,
};
