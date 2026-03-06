"use client"

import * as React from "react"

import { cn } from "./lib/utils"

type EncryptedTextProps = React.ComponentProps<"span"> & {
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
  const ref = React.useRef<HTMLSpanElement>(null)
  const [isInView, setIsInView] = React.useState(false)
  const [revealCount, setRevealCount] = React.useState(0)
  const [, setFlipTick] = React.useState(0)

  const animationFrameRef = React.useRef<number | null>(null)
  const startTimeRef = React.useRef(0)
  const lastFlipTimeRef = React.useRef(0)
  const scrambleCharsRef = React.useRef<string[]>(
    text ? scramblePreservingSpaces(text, charset).split("") : []
  )

  React.useEffect(() => {
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
  }, [])

  React.useEffect(() => {
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
  }, [isInView, text, revealDelayMs, charset, flipDelayMs, scrambleOnly, scrambleOneChar])

  if (!text) return null

  return (
    <span
      ref={ref}
      data-slot="encrypted-text"
      className={className}
      aria-label={text}
      {...props}
    >
      {text.split("").map((char, index) => {
        const isRevealed = !scrambleOnly && index < revealCount
        const displayChar = isRevealed
          ? char
          : char === " "
            ? " "
            : (scrambleCharsRef.current[index] ?? randomChar(charset))

        return (
          <span
            key={index}
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
