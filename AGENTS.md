# wratlas — Agent Guide

## Identity

Single-page Preact canvas editor. Routes: `/` (canvas editor), `/assets` (asset library), and a catch-all 404.

## Stack (Locked)

| Layer | Choice |
|---|---|
| Framework | **Preact** (NOT React). Avoid `preact/compat`. |
| Language | TypeScript 6.0 (`tsgo` binary, not `tsc`) |
| Bundler | Vite + `@preact/preset-vite` |
| Routing | `preact-iso` (`LocationProvider`, `Router`, `Route`, `lazy`) |
| State | `@preact/signals` |
| Styling | vanilla-extract (`*.css.ts`) + `@vanilla-extract/recipes` |
| Icons | `lucide-preact` |
| Lint/Format | Biome |
| Package mgr | Bun |
| Canvas | `fabric` v7 (named imports, e.g. `import { Canvas as FabricCanvas }`) |
| E2E tests | Playwright |

## Commands

```sh
bun dev                        # dev server
bun build                      # tsgo -b && vite build
bun format                     # biome format --write .
bun lint                       # biome check with --assist-enabled (auto-fix + organize imports)
bun typecheck                  # tsgo --build --noEmit (NOT tsc)
bun run check                  # full CI: format → lint → typecheck
bun run e2e                    # playwright test (dev server starts on port 4173)
bun run e2e:headed             # headed playwright
```

E2e tests live in `tests/e2e/` using Page Object Model (`tests/e2e/pages/`). No unit tests yet.

## Architecture

```
src/
├── main.tsx                 # entrypoint (render App, init theme)
├── app.tsx                  # router (LocationProvider → Router → lazy pages)
├── pages/
│   ├── canvas.tsx           # route / — wraps <Canvas> in <PageLayout>
│   └── assets.tsx           # route /assets — asset library page
├── packages/
│   ├── canvas/              # core canvas domain
│   │   ├── state.ts         # signals hub (re-exports store + controller + tool signals)
│   │   ├── internal/        # encapsulated internals (controller, store, history, arrange, etc.)
│   │   ├── hooks/           # feature hooks (png-export, drag-drop, shortcuts, etc.)
│   │   └── canvas.tsx       # main canvas component
│   └── assets/              # asset library domain
├── ui/
│   ├── atoms/               # tiny reusable primitives (Button, Modal, Menu, Box, Flex, etc.)
│   └── molecules/           # medium composites (Toolbar, Combobox, Toast, PageLayout, etc.)
├── lib/                     # shared utilities (cn, download, notification, theme, etc.)
├── styles/                  # design tokens (vars.css.ts), themes, global styles
└── vendor/                  # vendored code (jscolorpicker) — excluded from biome
```

## Code Rules

- **No comments** in code.
- **No default exports** except page components (required by `lazy`).
- **Arrow functions** for components and helpers.
- **`cn(...)` utility** for combining class names (`src/lib/cn.ts`).
- **No wrapper `<div>`** unless using `<Box>` for its style shorthands (`w`, `h`, `p`, `m`, `bg`, `bd`).
- **Files under ~300 lines.**
- **No external state libraries** — signals only.
- **No inline `style` props** (except dynamic runtime values like canvas viewport positions).

## TypeScript Constraints

- `verbatimModuleSyntax: true` — always use `import type` for type-only imports.
- `erasableSyntaxOnly: true` — no non-const enums, no legacy decorators.
- `noUnusedLocals` / `noUnusedParameters` — unused code is an error.
- Path alias `@/` → `src/` configured in both `vite.config.ts` and `tsconfig.app.json`.
- `preact/compat` is aliased to `react` / `react-dom` in tsconfig paths — do not import it directly.

## Styling

- **TUI aesthetic**: sharp corners (no border-radius), monospace-driven, terminal-like.
- Tokens from `src/styles/vars.css.ts` via typed `vars` object.
- Component variants via `@vanilla-extract/recipes`, inferred with `RecipeVariants<typeof recipe>`.
- `src/ui/` IS the design system. Packages use UI components from there; avoid custom `*.css.ts` in packages. Layout spacing should use Box/Flex props.

## Biome Formatting Quirks

- `indentStyle: space`, `indentWidth: 2`, `lineWidth: 120`
- `quoteStyle: double`, `semicolons: asNeeded`, `arrowParentheses: asNeeded`, `trailingCommas: all`
- `organizeImports` runs on save/format.

## Canvas Package Internals

- `state.ts` exports all shared signals (tool, zoom, pan, active object, etc.).
- `internal/controller.ts` is the imperative API surface (arrange, order, add image, copy, persist).
- `internal/store.ts` owns canvas CRUD (create, switch, delete).
- `internal/history.ts` — undo/redo with snapshot patches.
- `internal/arrange.ts` — potpack-based layout, only positions images (text/rects untouched).
- Available tools: `"select" | "draw" | "text" | "sticky" | "pan"`.

## Verification Order

```sh
bun run format  &&  bun run lint  &&  bun run typecheck
```

After behavior changes, manually test in the browser at `/`.
