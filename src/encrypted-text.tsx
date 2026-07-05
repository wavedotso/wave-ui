"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

import { cn } from "./lib/utils"

export type EncryptedTextProps = React.ComponentProps<"span"> & {
  text: string
  revealDelayMs?: number
  charset?: string
  flipDelayMs?: number
  encryptedClassName?: string
  revealedClassName?: string
  scrambleOnly?: boolean
  scrambleOneChar?: boolean
}

const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?"

function randomChar(charset: string): string {
  return charset.charAt(Math.floor(Math.random() * charset.length))
}

function scramblePreservingSpaces(original: string, charset: string): string {
  if (!original) return ""
  let result = ""
  for (let i = 0; i < original.length; i += 1) {
    result += original[i] === " " ? " " : randomChar(charset)
  }
  return result
}

function EncryptedText({
  text,
  className,
  revealDelayMs = 50,
  charset = DEFAULT_CHARSET,
  flipDelayMs = 50,
  encryptedClassName,
  revealedClassName,
  scrambleOnly = false,
  scrambleOneChar = false,
  ...props
}: EncryptedTextProps) {
  const prefersReducedMotion = useReducedMotion()
  const ref = React.useRef<HTMLSpanElement>(null)
  const [isInView, setIsInView] = React.useState(false)
  const [revealCount, setRevealCount] = React.useState(0)
  const [, setFlipTick] = React.useState(0)

  const animationFrameRef = React.useRef<number | null>(null)
  const startTimeRef = React.useRef(0)
  const lastFlipTimeRef = React.useRef(0)
  // Populated inside the animation effect (client-only). Left empty on the
  // first render so SSR and the initial client render show plain text and
  // agree — scrambling with Math.random() here would cause a hydration
  // mismatch.
  const scrambleCharsRef = React.useRef<string[]>([])

  React.useEffect(() => {
    if (prefersReducedMotion) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [prefersReducedMotion])

  React.useEffect(() => {
    if (prefersReducedMotion) return
    if (!isInView) return

    const initial = text
      ? scramblePreservingSpaces(text, charset)
      : ""
    scrambleCharsRef.current = initial.split("")
    startTimeRef.current = performance.now()
    lastFlipTimeRef.current = startTimeRef.current
    setRevealCount(0)

    let isCancelled = false

    const update = (now: number) => {
      if (isCancelled) return

      const totalLength = text.length

      if (scrambleOnly) {
        const timeSinceLastFlip = now - lastFlipTimeRef.current
        if (timeSinceLastFlip >= Math.max(0, flipDelayMs)) {
          if (scrambleOneChar) {
            const indices: number[] = []
            for (let i = 0; i < totalLength; i++) {
              if (text[i] !== " ") indices.push(i)
            }
            if (indices.length > 0) {
              const idx = indices[Math.floor(Math.random() * indices.length)]!
              scrambleCharsRef.current[idx] = randomChar(charset)
            }
          } else {
            for (let index = 0; index < totalLength; index += 1) {
              scrambleCharsRef.current[index] =
                text[index] === " " ? " " : randomChar(charset)
            }
          }
          lastFlipTimeRef.current = now
          setFlipTick((t) => (t + 1) & 0xffff)
        }
        animationFrameRef.current = requestAnimationFrame(update)
        return
      }

      const elapsedMs = now - startTimeRef.current
      const currentRevealCount = Math.min(
        totalLength,
        Math.floor(elapsedMs / Math.max(1, revealDelayMs))
      )

      setRevealCount(currentRevealCount)

      if (currentRevealCount >= totalLength) return

      const timeSinceLastFlip = now - lastFlipTimeRef.current
      if (timeSinceLastFlip >= Math.max(0, flipDelayMs)) {
        for (let index = currentRevealCount; index < totalLength; index += 1) {
          scrambleCharsRef.current[index] =
            text[index] === " " ? " " : randomChar(charset)
        }
        lastFlipTimeRef.current = now
        // Repaint the flipped glyphs — mutating the ref alone won't, so
        // without this flipDelayMs would be clamped to revealDelayMs.
        setFlipTick((t) => (t + 1) & 0xffff)
      }

      animationFrameRef.current = requestAnimationFrame(update)
    }

    animationFrameRef.current = requestAnimationFrame(update)

    return () => {
      isCancelled = true
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [prefersReducedMotion, isInView, text, revealDelayMs, charset, flipDelayMs, scrambleOnly, scrambleOneChar])

  if (!text) return null

  return (
    <span
      ref={ref}
      data-slot="encrypted-text"
      className={className}
      {...props}
    >
      {/* Real text for assistive tech; the animated glyphs below are decorative
       * (aria-label on a role-less span is unreliable, and the scrambled
       * characters must not be read out). */}
      <span className="sr-only">{text}</span>
      {text.split("").map((char, index) => {
        // Reduced motion: skip the scramble entirely and show every
        // character in its final revealed form from the first frame.
        // Before the animation starts (SSR + first client render, until the
        // in-view effect populates scrambleCharsRef), show plain text so
        // server and client agree — no Math.random() during render.
        const isRevealed =
          prefersReducedMotion ||
          !isInView ||
          (!scrambleOnly && index < revealCount)
        const displayChar = isRevealed
          ? char
          : char === " "
            ? " "
            : (scrambleCharsRef.current[index] ?? char)

        return (
          <span
            key={index}
            aria-hidden="true"
            data-slot="encrypted-text-char"
            data-revealed={isRevealed || undefined}
            className={cn(isRevealed ? revealedClassName : encryptedClassName)}
          >
            {displayChar}
          </span>
        )
      })}
    </span>
  )
}

export { EncryptedText }
