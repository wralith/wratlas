# Project conventions

EVERYTHING IN CODE SHOULD BE SUPER SIMPLE AND READABLE.

## Stack

- **Framework:** Preact (NOT React). Use `preact/compat` only if absolutely needed.
- **Language:** TypeScript.
- **Bundler:** Vite with `@preact/preset-vite`.
- **Routing:** `preact-iso` (`LocationProvider`, `Router`, `Route`, `lazy`).
- **State:** `@preact/signals`.
- **Styling:** vanilla-extract (`*.css.ts`) with `@vanilla-extract/recipes` for variants.
- **Icons:** `lucide-preact`.
- **Linting/Formatting:** Biome. Run `bun format` before committing.
- **Package manager:** Bun.

## Conventions

- **No comments in code** unless absolutely necessary.
- **No default exports** except page components (lazy needs them).
- **vanilla-extract** for component styles. Use named imports from `*.css.ts` files.
- **Design tokens** from `src/styles/vars.css.ts` — always reference via the typed `vars` object.
- **Recipes** (`@vanilla-extract/recipes`) for components with style variants.
- **`RecipeVariants<typeof recipe>`** for component prop types — never manually redefine variant props.
- **No prop drilling** — use signals or composition.
- **Atoms** in `components/atoms/` for tiny reusable UI primitives.
- **Arrow functions** for components.
- **No wrapper divs** unless needed for layout.
- **Keep files under ~300 lines.** Don't split if colocation is fine.
- **No external state libraries** beyond signals.
