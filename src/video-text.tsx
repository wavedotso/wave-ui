"use client";

import * as React from "react";

import { mergeRefs } from "./lib/merge-refs";
import { cn } from "./lib/utils";

interface VideoTextProps extends React.ComponentProps<"div"> {
  /** Video source URL. */
  src: string;
  /** The text the video shows through. Also announced to screen readers. */
  text: string;
  /** Image shown in the letters until the video can play. */
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: "auto" | "metadata" | "none";
  /**
   * A number is a percentage of the component's width; a string (`"8rem"`)
   * is used as-is.
   */
  fontSize?: string | number;
}

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

/** Keeps text like `R&D` or `"Wave"` from breaking the SVG markup. */
function escapeXml(value: string | number) {
  return String(value).replace(/[&<>"']/g, (char) => XML_ESCAPES[char] ?? char);
}

/**
 * Text cut out of a playing video. The letters take the root's `font-family`
 * and `font-weight`, so `font-*` classes style them. The mask is an SVG image,
 * which can't load web fonts: system fonts (the library default) render as
 * set, and a web font falls back to the next font in its stack. Until the
 * video paints, the letters show in the current text color.
 */
function VideoText({
  src,
  text,
  poster,
  autoPlay = true,
  muted = true,
  loop = true,
  preload = "auto",
  fontSize = 20,
  className,
  ref,
  ...props
}: VideoTextProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = React.useMemo(() => mergeRefs(rootRef, ref), [ref]);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  // Generic stand-ins for the first render (and the server), replaced by the
  // root's computed font before paint.
  const [fontFamily, setFontFamily] = React.useState("sans-serif");
  const [fontWeight, setFontWeight] = React.useState("bold");

  // Read once on mount, before paint, from the root's `font-*` classes.
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const computed = getComputedStyle(root);
    setFontFamily(computed.fontFamily);
    setFontWeight(computed.fontWeight);
  }, []);

  // A looping video is decorative motion, so it holds still while reduced
  // motion is on, like the library's other effects, and resumes when it's
  // turned off. Pausing on every `play` also catches the autoplay that a new
  // `src` starts.
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hold = () => {
      if (reducedMotion.matches) video.pause();
    };
    const sync = () => {
      if (reducedMotion.matches) {
        video.pause();
      } else if (video.autoplay) {
        // The browser can refuse (an unmuted video, Low Power Mode); the
        // video then stays paused, which is all a refusal means here.
        video.play().catch(() => {});
      }
    };

    hold();
    video.addEventListener("play", hold);
    reducedMotion.addEventListener("change", sync);
    return () => {
      video.removeEventListener("play", hold);
      reducedMotion.removeEventListener("change", sync);
    };
  }, []);

  // Inside the SVG image, `vw` is a percentage of the image, which is sized
  // to the component.
  const size = typeof fontSize === "number" ? `${fontSize}vw` : fontSize;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><text x='50%' y='50%' font-size='${escapeXml(size)}' font-weight='${escapeXml(fontWeight)}' text-anchor='middle' dominant-baseline='middle' font-family='${escapeXml(fontFamily)}'>${escapeXml(text)}</text></svg>`;
  const mask = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

  return (
    <div
      ref={mergedRef}
      data-slot="video-text"
      className={cn("relative size-full font-sans font-bold", className)}
      {...props}
    >
      <div
        data-slot="video-text-mask"
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center bg-current mask-contain mask-center mask-no-repeat"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- decorative, muted and aria-hidden; the text is announced by the sr-only label */}
        <video
          ref={videoRef}
          data-slot="video-text-video"
          className="size-full object-cover"
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          preload={preload}
          playsInline
          disablePictureInPicture
          disableRemotePlayback
        />
      </div>
      <span data-slot="video-text-label" className="sr-only">
        {text}
      </span>
    </div>
  );
}

export { VideoText };
export type { VideoTextProps };
