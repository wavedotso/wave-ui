"use client"

import * as React from "react"

import { useFilmGrain } from "./film-grain-webgl"
import { cn } from "./lib/utils"

interface FilmGrainProps {
  density?: number
  opacity?: number
  blendMode?: React.CSSProperties["mixBlendMode"]
  fps?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}

function FilmGrain({
  density = 0.6,
  opacity = 0.08,
  blendMode = "overlay",
  fps = 18,
  color = "#ffffff",
  className,
  style,
}: FilmGrainProps) {
  const canvasRef = useFilmGrain({ density, opacity, fps, color })

  return (
    <div
      data-slot="film-grain"
      aria-hidden="true"
      className={cn(
        "absolute inset-0 z-0 pointer-events-none select-none overflow-hidden",
        className,
      )}
      style={{ mixBlendMode: blendMode, opacity, ...style }}
    >
      <canvas
        ref={canvasRef}
        data-slot="film-grain-canvas"
        className="w-full h-full will-change-transform"
      />
    </div>
  )
}

export { FilmGrain }
export type { FilmGrainProps }
