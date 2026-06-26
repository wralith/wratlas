import { style } from "@vanilla-extract/css"
import { vars } from "../../styles/vars.css.ts"

export const layout = style({
  display: "flex",
  flexDirection: "column",
  height: "100dvh",
})

export const content = style({
  flex: 1,
  overflowY: "auto",
  margin: "0 1rem 1rem",
  padding: vars.space.md,
  background: vars.bg.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
})
