---
description: Implement a scoped feature with project standards and QA checks.
agent: build
---

Implement this feature request: $ARGUMENTS

Follow this workflow:

1. Explore related files first and match existing patterns in this repo.
2. Keep implementation simple, explicit, and easy to scan.
3. Respect AGENTS.md rules:
   - Preact patterns only
   - no unnecessary abstractions
   - no new dependencies unless clearly required
4. Run `bun run check` after changes.
5. Return:
   - files changed
   - short explanation of behavior change
   - verification results
   - any follow-up risks or TODOs
