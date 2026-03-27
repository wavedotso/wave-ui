"use client"

import * as React from "react"
import { useFilmGrain } from "./film-grain-webgl"

interface FilmGrainProps {
  density?: number
  opacity?: number
  blendMode?: React.CSSProperties["mixBlendMode"]
  fps?: number
  color?: string
  className?: string
}

function FilmGrain({
  density = 0.6,
  opacity = 0.08,
  blendMode = "overlay",
  fps = 18,
  color = "#ffffff",
  className,
}: FilmGrainProps) {
  const canvasRef = useFilmGrain({ density, opacity, fps, color })

  return (
    <div
      aria-hidden="true"
      className={[
        "absolute inset-0 z-0 pointer-events-none select-none overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ mixBlendMode: blendMode, opacity }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full will-change-transform"
      />
    </div>
  )
}

export { FilmGrain }
export type { FilmGrainProps }
