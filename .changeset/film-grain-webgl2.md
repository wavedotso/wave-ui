---
"@waveso/ui": minor
---

`FilmGrain` now draws with WebGL2 and an integer hash instead of a sine one. The grain looks the same, its finest specks a little softer, and it no longer draws faint stripes on mobile GPUs where a sine hash loses precision. It is also cheaper: its medium and coarse layers and its clumping share one hash per 4×4 block, and the second fine layer it computed for a crossfade it never showed is gone. Where WebGL2 is unavailable, the existing Canvas 2D grain draws instead.
