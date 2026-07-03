import * as React from 'react'

/**
 * The "Color" guide — Wave's color philosophy, rendered as the
 * `Colors/Overview` MDX docs page. Kept as a component (not a story) so the
 * article is authored in exactly one place and embedded once via MDX, with no
 * autodocs primary/story echo. Lives under `src/docs/**`, which the build
 * excludes — it never ships in the package.
 */

function Code({ children }: { children: React.ReactNode }) {
  return <code className="bg-surface rounded px-1 py-0.5 font-mono text-[0.85em]">{children}</code>
}

export function ColorGuide() {
  return (
    <div className="bg-foundation text-contrast min-h-screen p-10">
      <article className="mx-auto max-w-2xl">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">Color</h1>
          <p className="mt-3 text-base text-muted">
            Color in Wave communicates status, expresses the brand, and guides attention. Every color is <span className="text-contrast">semantic</span> — defined by its job,
            adaptive to light and dark, and built to stay legible. Here's how the palette is designed, and
            how to use it well.
          </p>
        </header>

        <div className="space-y-9 leading-relaxed">
          <section>
            <h2 className="mb-2 text-2xl font-semibold">Use the token, never the value</h2>
            <p className="mt-3 text-muted">
              <strong className="font-semibold text-contrast">Avoid hard-coding a color.</strong> Documented hex values are for
              reference only — the real values shift with theme and appearance. Reach for a semantic token — <Code>bg-primary</Code>, <Code>text-muted</Code>, <Code>border-edge</Code> — and let the system resolve it. Re-skin the entire library by overriding the semantic layer; the components never change.
            </p>
            <p className="mt-3 text-muted">
              <strong className="font-semibold text-contrast">Use a color consistently.</strong> One color, one meaning. For example, Wave Blue
              means "primary / interactive," so don't reuse it to style text that isn't.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold">One brand color, kept constant</h2>
            <p className="mt-3 text-muted">
              Wave's brand is <strong className="font-semibold text-contrast">Wave Blue</strong> — a calm, trustable cobalt, chosen to be <em>ownable</em> rather than the blue every app already ships. It drives <Code>--primary</Code>, the focus ring, links (<Code>--info</Code>), and the bright signal (<Code>--accent</Code>). It stays the <strong className="font-semibold text-contrast">same in light and dark</strong> on purpose: a constant color is a constant brand.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold">Work in light, dark, and increased contrast</h2>
            <p className="mt-3 text-muted">
              <strong className="font-semibold text-contrast">Supply a light and a dark variant for anything colored.</strong> Surfaces, text and borders flip on the <Code>.dark</Code> axis; the neutral character switches with the theme class (Graphite · Ink · Paper). Status colors carry both variants and the dark one is always <strong className="font-semibold text-contrast">slightly brighter, never darker</strong> (a ~3% hue-aware lift), so a color keeps its presence on a dark surface instead of receding into it.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold">Put color in fills and symbols — not in text</h2>
            <p className="mt-3 text-muted">
              The rule that shapes the whole status system: <strong className="font-semibold text-contrast">vivid colors belong on fills, icons and dots; text stays neutral.</strong> Success is a green checkmark beside plain words — not green words. Coloring text forces you to darken it for contrast until a yellow turns to brown, destroying the very identity the color exists to carry. Keep the color in the glyph and the label neutral, and you get identity <em>and</em> legibility at no cost.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold">Never rely on color alone</h2>
            <p className="mt-3 text-muted">
              <strong className="font-semibold text-contrast">Pair color with shape and text.</strong> A status is an icon (eg. check, triangle) <em>and</em> a word so meaning survives color blindness and cultural differences (a rising stock reads green in the US, red in China). Color reinforces meaning; it never carries it alone.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold">The status palette</h2>
            <p className="mt-3 text-muted">Four semantic roles. Calm where they can be, loud where they must be:</p>
            <ul className="mt-3 space-y-2 pl-1 text-muted">
              <li>
                <strong className="font-semibold text-contrast">Success</strong> — a cool emerald, deliberately kept off the common
                Apple/Tailwind green so it reads as <em>ours</em>, and clearly apart from the warning yellow.
              </li>
              <li>
                <strong className="font-semibold text-contrast">Warning</strong> — an amber, held well away from the green.
              </li>
              <li>
                <strong className="font-semibold text-contrast">Destructive</strong> — the most saturated of the set; an error is the
                one thing that should genuinely alarm.
              </li>
              <li>
                <strong className="font-semibold text-contrast">Info</strong> — Wave Blue. Informational <em>is</em> the brand.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold">Authored in OKLCH, wide-gamut ready</h2>
            <p className="mt-3 text-muted">
              Every color is defined in <strong className="font-semibold text-contrast">OKLCH</strong>, so lightness is perceptually
              even and adjusting one channel doesn't skew the others. On Display-P3 screens the palette renders in wide
              gamut; on sRGB it falls back cleanly.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold">Accessibility is the floor</h2>
            <p className="mt-3 text-muted">
              <strong className="font-semibold text-contrast">Meet contrast, and respect the person's settings.</strong> Text targets
              WCAG AA (4.5:1); never override someone's chosen appearance or contrast level. The structure tokens (
              <Code>--line</Code>, <Code>--edge</Code>, <Code>--solid</Code>, <Code>--focus</Code>) and the layered
              surfaces are tuned to keep text and controls legible on every theme.
            </p>
          </section>
        </div>
      </article>
    </div>
  )
}
