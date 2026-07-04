# Project Guide

EVERYTHING IN CODE SHOULD BE SUPER SIMPLE AND READABLE.

## What We Have Built So Far

- App shell with route-based pages: `home`, `playground`, `library`, `journey`, and `not-found`.
- Reusable UI primitives under `src/ui/atoms/` and `src/ui/molecules/`.
- Canvas package under `src/packages/canvas/` with isolated internals and hooks.
- Canvas features already implemented:
  - panning and zoom
  - drag/drop image insertion
  - object selection and delete
  - undo/redo history
  - keyboard shortcuts and shortcuts modal
  - persistence/hydration
  - import/export flow
  - toolbar + combobox extracted as reusable canvas UI pieces
- Foundation for larger roadmap:
  - Playground = active core domain
  - Library/Journey pages exist as placeholders for future domain work

## Current Quality Standards

### Core Principles

- Prefer clarity over cleverness.
- Keep logic flat, explicit, and easy to scan.
- Build small composable units over large multi-purpose abstractions.
- Make state and side effects obvious.

### Stack (Locked)

- **Framework:** Preact (NOT React). Use `preact/compat` only if absolutely needed.
- **Language:** TypeScript.
- **Bundler:** Vite with `@preact/preset-vite`.
- **Routing:** `preact-iso` (`LocationProvider`, `Router`, `Route`, `lazy`).
- **State:** `@preact/signals`.
- **Styling:** vanilla-extract (`*.css.ts`) with `@vanilla-extract/recipes` for variants.
- **Icons:** `lucide-preact`.
- **Linting/Formatting:** Biome (`bun format`, `bun lint`).
- **Package manager:** Bun.

### Code Rules

- **No comments in code** unless absolutely necessary.
- **No default exports** except page components (lazy needs them).
- **Arrow functions** for components and helpers.
- **No wrapper divs** unless needed for layout.
- **Keep files under ~300 lines.** Do not split aggressively if colocation keeps things clear.
- **No external state libraries** beyond signals.

### Styling Rules

- **TUI aesthetic** — sharp corners (no border-radius), monospace-driven, terminal-like appearance. No rounded borders or soft UI elements.
- Use **vanilla-extract** for component styles and import named exports from `*.css.ts` files.
- Use tokens from `src/styles/vars.css.ts` through typed `vars` only.
- Use recipes for visual variants and infer variant props using:
  - `RecipeVariants<typeof recipe>`

### Architecture Rules

- No prop drilling; use signals or composition.
- Keep tiny reusable primitives in `src/ui/atoms/`.
- Keep medium reusable components in `src/ui/molecules/`.
- Keep app-specific pieces in `src/components/`.
- Keep canvas package internals encapsulated in `src/packages/canvas/internal/`.

### Definition of Done

- New code follows the rules above and matches surrounding patterns.
- `bun format` is run for touched files.
- `bun lint` passes.
- `bun typecheck` passes for behavior or type changes.
- If behavior changed, validate manually in relevant page route.

## How We Should Use Agents and AI

### Default Working Pattern

- Use AI to draft first-pass implementation quickly.
- Immediately run a cleanup pass focused on readability and simplification.
- Ask AI to do a reviewer pass with this checklist:
  - Is this simpler?
  - Is naming clear?
  - Are concerns split correctly?
  - Any hidden side effects?
  - Any rules in this file violated?
- Keep PRs/tasks narrow: one focused outcome per change.

### Recommended Agent Roles

- **Explorer agent:** map files, find existing patterns, and identify where new code belongs.
- **Builder agent:** implement using existing conventions and minimal abstractions.
- **Reviewer agent:** verify standards, surface complexity, and suggest simplifications.
- **QA agent:** run/check `format`, `lint`, `typecheck`, and test/route verification checklist.

### Good Agent Prompts For This Repo

- "Implement this with the fewest moving parts and zero unnecessary abstractions."
- "Match existing patterns in `src/packages/canvas` and `src/ui/atoms`."
- "Refactor for readability only; no behavior change."
- "List violations of AGENTS.md rules with exact file references."

### Safety Rules For AI Output

- Reject any output that introduces React-only APIs where Preact-native APIs are enough.
- Reject broad rewrites when a small targeted edit works.
- Reject new dependencies unless there is a clear gap and explicit decision.
- Prefer explicit types over complex generics unless necessary.

## Opencode Skills and Plugin Direction

### Skills Worth Adding Next

- **Testing-focused skill:** to standardize fast test authoring and regression checks.
- **Refactor/review skill:** to enforce readability and complexity reduction passes.
- **Docs/changelog skill:** to keep roadmap and engineering notes aligned with shipped work.

### Existing Skill Use

- `find-skills` is useful when we need to discover ecosystem skills quickly.

### Plugin Ideas For This Project

- **Command wrappers:** single command to run `bun format && bun lint && bun typecheck`.
- **PR checklist helper:** auto-generate task-specific checklist from this AGENTS file.
- **Canvas regression helper:** scripted smoke checks for playground core interactions.

## Near-Term Focus

- Continue hardening Playground as the core product surface.
- Start real Library model (metadata/tagging/search).
- Start Journey model (milestones/nodes linked to canvases).
- Keep standards strict while feature velocity grows.
