"use client";

import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { minWidth } from "@/lib/breakpoints";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import type { HeroVideo as HeroVideoSources } from "@/types/content";

/**
 * The looping hero video, laid over the poster image that the server renders (the LCP element).
 * It is added only on the client and only when motion is allowed, so reduced-motion users never
 * download it and keep the poster. It fades in once it plays, and a pause button stops it
 * (WCAG 2.2.2: moving content longer than 5 s needs a pause control).
 */
export function HeroVideo({ video }: { video: HeroVideoSources }) {
  const reduceMotion = usePrefersReducedMotion(true);
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);

  if (reduceMotion) return null;

  function toggle() {
    const element = ref.current;
    if (!element) return;
    if (element.paused) {
      void element.play();
      setPaused(false);
    } else {
      element.pause();
      setPaused(true);
    }
  }

  return (
    <>
      <video
        ref={ref}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onPlaying={() => setPlaying(true)}
        className={cn(
          "absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500",
          playing && "opacity-100",
        )}
      >
        {/* Wide crop from lg, the portrait crop below; WebM first, H.264 as the fallback. */}
        <source media={minWidth("lg")} src={video.lg.webm} type="video/webm" />
        <source media={minWidth("lg")} src={video.lg.mp4} type="video/mp4" />
        <source src={video.portrait.webm} type="video/webm" />
        <source src={video.portrait.mp4} type="video/mp4" />
      </video>
      <Button
        type="button"
        variant="special"
        size="icon"
        onClick={toggle}
        aria-label={paused ? "Play video" : "Pause video"}
        className="absolute right-gutter bottom-stack-md z-20"
      >
        {paused ? (
          <Play size={24} aria-hidden="true" />
        ) : (
          <Pause size={24} aria-hidden="true" />
        )}
      </Button>
    </>
  );
}
