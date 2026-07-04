import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const bar = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: vars.hudHeight,
  padding: `0 ${vars.space.md}`,
  border: `1px solid ${vars.color.border}`,
  borderTop: "none",
  backgroundColor: vars.bg.surface,
  flexShrink: 0,
  gap: vars.space.md,
  borderRadius: `0 0 ${vars.radius.md} ${vars.radius.md}`,
})
