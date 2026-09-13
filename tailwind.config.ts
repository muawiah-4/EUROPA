import type { Config } from "tailwindcss";

// Standard Tailwind recipe for a CSS-variable-backed color that still
// supports the /NN opacity modifier (bg-void/50, text-mist/80, etc.).
// Requires the variable itself to hold space-separated "R G B" channels
// (see app/globals.css), not a hex string — a plain `var(--x)` color
// silently breaks every opacity-modified utility built on it (Tailwind
// drops the utility from its output entirely rather than erroring, which
// is what made this easy to ship unnoticed the first time around).
// Cast to `string`: Tailwind's own Config type doesn't model function-valued
// colors even though the runtime fully supports them (and requires them for
// this exact CSS-variable-plus-opacity pattern) — this satisfies the type
// checker without changing what Tailwind actually receives at build time.
function withOpacity(variable: string): string {
  return (({ opacityValue }: { opacityValue?: string }) =>
    opacityValue === undefined ? `rgb(var(${variable}))` : `rgb(var(${variable}) / ${opacityValue})`) as unknown as string;
}

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Reference the CSS custom properties (defined in app/globals.css)
        // rather than hardcoding hex here — these two files were previously
        // out of sync (globals.css's --void/--panel could be edited with no
        // visible effect anywhere, since every bg-void/bg-panel utility
        // compiled to its own separate hardcoded hex). Now there's one
        // source of truth.
        void: withOpacity("--void"),
        panel: withOpacity("--panel"),
        elevated: withOpacity("--elevated"),
        bone: withOpacity("--bone"),
        mist: withOpacity("--mist"),
        smoke: withOpacity("--smoke"),
        mint: withOpacity("--mint"),
      },
      fontFamily: {
        display: [
          "var(--font-display)",
          "Times New Roman",
          "Times",
          "Georgia",
          "serif",
        ],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
