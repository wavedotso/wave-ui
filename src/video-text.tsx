"use client";

import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

import { cn } from "./lib/utils";

interface VideoTextProps extends Omit<
  useRender.ComponentProps<"div">,
  "children"
> {
  /** Video source URL. */
  src: string;
  /** The text the video shows through. Rendered as real, selectable text. */
  text: string;
  /** Image shown in the letters until the video can play. */
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: "auto" | "metadata" | "none";
}

interface WordBox {
  x: number;
  y: number;
}

function isSameLayout(a: WordBox[], b: WordBox[]) {
  return (
    a.length === b.length &&
    a.every((box, index) => box.x === b[index]?.x && box.y === b[index]?.y)
  );
}

/**
 * Text cut out of a playing video. The text is real: it wraps, aligns and
 * takes its font from the usual classes (`text-*`, `font-*`, web fonts
 * included), and `render` can make it a heading. Each word is measured and
 * copied into an SVG clip path that the video is clipped to. Until that's
 * measured, and while the video loads, the letters show in the text color.
 */
function VideoText({
  src,
  text,
  poster,
  autoPlay = true,
  muted = true,
  loop = true,
  preload = "auto",
  className,
  render,
  ref,
  ...props
}: VideoTextProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const labelRef = React.useRef<HTMLSpanElement>(null);
  const baselineRef = React.useRef<HTMLSpanElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [boxes, setBoxes] = React.useState<WordBox[]>([]);

  const clipId = `video-text-${React.useId().replace(/[^\w-]/g, "")}`;
  const clipPath = `url(#${clipId})`;
  const words = React.useMemo(() => text.split(/\s+/).filter(Boolean), [text]);
  const isMeasured = words.length > 0 && boxes.length === words.length;

  // Where each word landed, re-read when the box resizes (rewrapping) or a
  // web font finishes loading (new metrics). SVG text sits on its baseline,
  // so `y` is the word's top plus the line's baseline offset. Measured from
  // client rects for sub-pixel accuracy (`offsetLeft` rounds to whole
  // pixels), relative to the padding box the clip path is laid out in, and
  // divided by `scale` so a transformed ancestor doesn't skew them.
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    const label = labelRef.current;
    const baseline = baselineRef.current;
    if (!root || !label || !baseline) return;

    const measure = () => {
      const rootRect = root.getBoundingClientRect();
      const scale = root.offsetWidth ? rootRect.width / root.offsetWidth : 1;
      const left = rootRect.left + root.clientLeft * scale;
      const top = rootRect.top + root.clientTop * scale;
      const spans = label.querySelectorAll<HTMLElement>(
        '[data-slot="video-text-word"]',
      );
      const first = spans[0]?.getBoundingClientRect();
      const offset = first
        ? baseline.getBoundingClientRect().top - first.top
        : 0;
      const next = words.map((_, index) => {
        const rect = spans[index]?.getBoundingClientRect();
        return rect
          ? {
              x: (rect.left - left) / scale,
              y: (rect.top + offset - top) / scale,
            }
          : { x: 0, y: 0 };
      });
      setBoxes((prev) => (isSameLayout(prev, next) ? prev : next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, [words]);

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

  // Spans only inside, so `render={<h1 />}` stays valid HTML.
  const content = (
    <>
      <span
        ref={labelRef}
        data-slot="video-text-label"
        className={cn(isMeasured && "text-transparent")}
      >
        <span
          ref={baselineRef}
          data-slot="video-text-baseline"
          className="inline-block size-0 align-baseline"
        />
        {words.map((word, index) => (
          <React.Fragment key={`${index}-${word}`}>
            {index > 0 && " "}
            <span data-slot="video-text-word">{word}</span>
          </React.Fragment>
        ))}
      </span>
      <svg
        data-slot="video-text-defs"
        aria-hidden="true"
        className="absolute size-0 overflow-hidden [direction:ltr]"
      >
        <clipPath
          id={clipId}
          data-slot="video-text-clip"
          clipPathUnits="userSpaceOnUse"
        >
          {words.map((word, index) => (
            <text
              key={`${index}-${word}`}
              data-slot="video-text-clip-word"
              x={boxes[index]?.x ?? 0}
              y={boxes[index]?.y ?? 0}
            >
              {word}
            </text>
          ))}
        </clipPath>
      </svg>
      <span
        data-slot="video-text-mask"
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 bg-current",
          !isMeasured && "invisible",
        )}
        style={{ clipPath, WebkitClipPath: clipPath }}
      >
        {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- decorative, muted and aria-hidden; the real text carries the meaning */}
        <video
          ref={videoRef}
          data-slot="video-text-video"
          className="block size-full object-cover"
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
      </span>
    </>
  );

  return useRender({
    defaultTagName: "div",
    ref: ref ? [rootRef, ref] : rootRef,
    render,
    props: mergeProps<"div">(
      {
        className: cn("relative font-sans font-bold", className),
        children: content,
      },
      props,
    ),
    state: {
      slot: "video-text",
    },
  });
}

export { VideoText };
export type { VideoTextProps };
