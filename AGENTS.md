# Project conventions

EVERYTHING IN CODE SHOULD BE SUPER SIMPLE AND READABLE.

## Stack

- **Framework:** Preact (NOT React). Use `preact/compat` only if absolutely needed.
- **Language:** TypeScript.
- **Bundler:** Vite with `@preact/preset-vite`.
- **Routing:** `preact-iso` (`LocationProvider`, `Router`, `Route`, `lazy`).
- **State:** `@preact/signals`.
- **Styling:** CSS Modules (`*.module.css`) + CSS custom properties (`vars.css`).
- **Icons:** `lucide-preact`.
- **Linting/Formatting:** Biome. Run `bun format` before committing.
- **Package manager:** Bun.

## Conventions

- **No comments in code** unless absolutely necessary.
- **No default exports** except page components (lazy needs them).
- **CSS Modules** for component styles. Use `styles` import pattern.
- **CSS custom properties** from `vars.css` for all colors, spacing, typography.
- **No prop drilling** — use signals or composition.
- **Atoms** in `components/atoms/` for tiny reusable UI primitives.
- **Arrow functions** for components.
- **No wrapper divs** unless needed for layout.
- **Keep files under ~300 lines.** Don't split if colocation is fine.
- **No external state libraries** beyond signals.
