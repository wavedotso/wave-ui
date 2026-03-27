import { useEffect, useRef, useMemo } from "react"
import { vertexShader, fragmentShader } from "./film-grain-shader"

interface UseFilmGrainOptions {
  density: number
  opacity: number
  /** Target FPS for both WebGL and canvas fallback. Default 18 */
  fps?: number
  /** Hex color for canvas fallback grain. Default '#ffffff' */
  color?: string
}

/** Parse hex color safely */
function parseHex(hex: string): [number, number, number, number] {
  if (!/^#([0-9a-f]{3,8})$/i.test(hex)) return [255, 255, 255, 255]
  let h = hex.replace("#", "")
  if (h.length === 3) h = h.split("").map((c) => c + c).join("")
  if (h.length === 6) h += "ff"
  const n = parseInt(h, 16)
  return [(n >> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]
}

// ── WebGL renderer ──────────────────────────────────────────────────

interface WebGLUniforms {
  uTime: WebGLUniformLocation | null
  uResolution: WebGLUniformLocation | null
  uDensity: WebGLUniformLocation | null
  uOpacity: WebGLUniformLocation | null
  uFps: WebGLUniformLocation | null
  uColor: WebGLUniformLocation | null
  program: WebGLProgram
  vs: WebGLShader
  fs: WebGLShader
  buffer: WebGLBuffer | null
}

function initWebGL(gl: WebGLRenderingContext): WebGLUniforms | null {
  const createShader = (type: number, source: string) => {
    const shader = gl.createShader(type)
    if (!shader) return null
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader)
      return null
    }
    return shader
  }

  const vs = createShader(gl.VERTEX_SHADER, vertexShader)
  const fs = createShader(gl.FRAGMENT_SHADER, fragmentShader)
  if (!vs || !fs) return null

  const program = gl.createProgram()
  if (!program) return null

  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }

  gl.useProgram(program)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  )

  const position = gl.getAttribLocation(program, "position")
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  return {
    uTime: gl.getUniformLocation(program, "uTime"),
    uResolution: gl.getUniformLocation(program, "uResolution"),
    uDensity: gl.getUniformLocation(program, "uDensity"),
    uOpacity: gl.getUniformLocation(program, "uOpacity"),
    uFps: gl.getUniformLocation(program, "uFps"),
    uColor: gl.getUniformLocation(program, "uColor"),
    program,
    vs,
    fs,
    buffer,
  }
}

/** Safe uniform setters */
function setUniform1f(
  gl: WebGLRenderingContext,
  loc: WebGLUniformLocation | null,
  val: number
) {
  if (loc) gl.uniform1f(loc, val)
}

function setUniform2f(
  gl: WebGLRenderingContext,
  loc: WebGLUniformLocation | null,
  x: number,
  y: number
) {
  if (loc) gl.uniform2f(loc, x, y)
}

function setUniform3f(
  gl: WebGLRenderingContext,
  loc: WebGLUniformLocation | null,
  x: number,
  y: number,
  z: number
) {
  if (loc) gl.uniform3f(loc, x, y, z)
}

// ── Canvas 2D fallback renderer ─────────────────────────────────────

function generateGrainTexture(
  width: number,
  height: number,
  density: number,
  color: string
): HTMLCanvasElement {
  const offscreen = document.createElement("canvas")
  offscreen.width = width
  offscreen.height = height
  const ctx = offscreen.getContext("2d")
  if (!ctx) return offscreen

  const [r, g, b, a] = parseHex(color)
  const imageData = ctx.createImageData(width, height)
  const pixels = new Uint32Array(imageData.data.buffer)

  for (let i = 0; i < pixels.length; i++) {
    if (Math.random() < density) {
      const variation = Math.round(a * (0.4 + Math.random() * 0.6))
      pixels[i] = ((variation << 24) | (b << 16) | (g << 8) | r) >>> 0
    }
  }

  ctx.putImageData(imageData, 0, 0)
  return offscreen
}

// ── Hook ────────────────────────────────────────────────────────────

export function useFilmGrain({
  density,
  opacity,
  fps = 18,
  color = "#ffffff",
}: UseFilmGrainOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number>(0)
  const visibleRef = useRef(true)
  const grainTextureRef = useRef<HTMLCanvasElement | null>(null)
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const interval = useMemo(() => 1000 / fps, [fps])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const container = canvas.parentElement
    if (!container) return

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    // Pause when offscreen
    const intersectionObs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) visibleRef.current = entry.isIntersecting
      },
      { threshold: 0.01 }
    )
    intersectionObs.observe(container)

    const getDimensions = () => {
      const dpr = window.devicePixelRatio || 1
      return {
        w: Math.round(canvas.clientWidth * dpr),
        h: Math.round(canvas.clientHeight * dpr),
        dpr,
      }
    }

    // ── Try WebGL ──

    const gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null)
    const uniforms = gl ? initWebGL(gl) : null

    if (gl && uniforms) {
      let contextLost = false

      const [cr, cg, cb] = parseHex(color)
      const setUniforms = () => {
        setUniform1f(gl, uniforms.uDensity, density)
        setUniform1f(gl, uniforms.uOpacity, opacity)
        setUniform1f(gl, uniforms.uFps, fps)
        setUniform3f(gl, uniforms.uColor, cr / 255, cg / 255, cb / 255)
      }

      const onContextLost = (e: Event) => {
        e.preventDefault()
        contextLost = true
        cancelAnimationFrame(rafRef.current)
      }

      const onContextRestored = () => {
        contextLost = false
        const newUniforms = initWebGL(gl)
        if (newUniforms) {
          uniforms.uTime = newUniforms.uTime
          uniforms.uResolution = newUniforms.uResolution
          uniforms.uDensity = newUniforms.uDensity
          uniforms.uOpacity = newUniforms.uOpacity
          uniforms.uFps = newUniforms.uFps
          uniforms.uColor = newUniforms.uColor
          uniforms.program = newUniforms.program
          uniforms.vs = newUniforms.vs
          uniforms.fs = newUniforms.fs
          uniforms.buffer = newUniforms.buffer
          resize()
          setUniforms()
          if (!prefersReducedMotion)
            rafRef.current = requestAnimationFrame(render)
        }
      }

      canvas.addEventListener("webglcontextlost", onContextLost)
      canvas.addEventListener("webglcontextrestored", onContextRestored)

      const resize = () => {
        const { w, h } = getDimensions()
        if (w === 0 || h === 0) return
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
        setUniform2f(gl, uniforms.uResolution, w, h)
      }

      resize()
      setUniforms()

      gl.clearColor(0, 0, 0, 0)

      const start = performance.now()
      let lastSeed = -1

      const render = (now: number) => {
        if (contextLost) return

        if (
          !document.hidden &&
          visibleRef.current &&
          canvas.width > 0 &&
          canvas.height > 0
        ) {
          const time = (now - start) / 1000

          // Skip draw if grain seed hasn't changed
          const seed = Math.floor(time * fps)
          if (seed !== lastSeed) {
            lastSeed = seed
            gl.clear(gl.COLOR_BUFFER_BIT)
            setUniform1f(gl, uniforms.uTime, time)
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
          }
        }

        rafRef.current = requestAnimationFrame(render)
      }

      if (prefersReducedMotion) {
        setUniform1f(gl, uniforms.uTime, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      } else {
        rafRef.current = requestAnimationFrame(render)
      }

      const onResize = () => {
        if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current)
        resizeTimerRef.current = setTimeout(resize, 150)
      }

      window.addEventListener("resize", onResize)

      return () => {
        cancelAnimationFrame(rafRef.current)
        if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current)
        window.removeEventListener("resize", onResize)
        canvas.removeEventListener("webglcontextlost", onContextLost)
        canvas.removeEventListener("webglcontextrestored", onContextRestored)
        intersectionObs.disconnect()

        gl.deleteBuffer(uniforms.buffer)
        gl.deleteShader(uniforms.vs)
        gl.deleteShader(uniforms.fs)
        gl.deleteProgram(uniforms.program)
      }
    }

    // ── Canvas 2D fallback ──

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      intersectionObs.disconnect()
      return
    }

    const padFactor = 0.3
    const getPad = (w: number, h: number) =>
      Math.round(Math.max(w, h) * padFactor)

    const setup = () => {
      const { w, h } = getDimensions()
      if (w === 0 || h === 0) return { w: 0, h: 0, pad: 0 }

      const pad = getPad(w, h)
      canvas.width = w
      canvas.height = h

      if (
        !grainTextureRef.current ||
        grainTextureRef.current.width < w + pad ||
        grainTextureRef.current.height < h + pad
      ) {
        grainTextureRef.current = generateGrainTexture(
          w + pad,
          h + pad,
          density,
          color
        )
      }

      return { w, h, pad }
    }

    let { w, h, pad } = setup()

    // Drifting offset for temporal coherence (not teleporting)
    let offsetX = 0
    let offsetY = 0

    const drawFrame = () => {
      const grain = grainTextureRef.current
      if (!grain || w === 0 || h === 0) return

      const dpr = window.devicePixelRatio || 1

      ctx.clearRect(0, 0, w, h)
      ctx.filter = `blur(${0.3 * dpr}px)`

      offsetX = (offsetX + 0.7) % pad
      offsetY = (offsetY + 0.5) % pad

      ctx.drawImage(grain, -offsetX, -offsetY, w + pad, h + pad)
      ctx.filter = "none"
    }

    if (prefersReducedMotion) {
      drawFrame()
      intersectionObs.disconnect()
      grainTextureRef.current = null
      return
    }

    let lastFrame = performance.now()

    const tick = (now: number) => {
      if (
        !document.hidden &&
        visibleRef.current &&
        w > 0 &&
        h > 0
      ) {
        while (now - lastFrame >= interval) {
          lastFrame += interval
          drawFrame()
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    const onResize = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current)
      resizeTimerRef.current = setTimeout(() => {
        const m = getDimensions()
        const newPad = getPad(m.w, m.h)

        if (
          grainTextureRef.current &&
          grainTextureRef.current.width >= m.w + newPad &&
          grainTextureRef.current.height >= m.h + newPad
        ) {
          w = m.w
          h = m.h
          pad = newPad
          canvas.width = w
          canvas.height = h
          return
        }

        w = m.w
        h = m.h
        pad = newPad
        canvas.width = w
        canvas.height = h
        grainTextureRef.current = generateGrainTexture(
          w + pad,
          h + pad,
          density,
          color
        )
      }, 150)
    }

    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current)
      window.removeEventListener("resize", onResize)
      intersectionObs.disconnect()
      grainTextureRef.current = null
    }
  }, [density, opacity, fps, interval, color])

  return canvasRef
}
