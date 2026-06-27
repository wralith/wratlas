import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const toolbar = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: vars.hudHeight,
  padding: `0 ${vars.space.md}`,
  borderBottom: `1px solid ${vars.color.border}`,
  backgroundColor: vars.bg.surface,
  flexShrink: 0,
})

export const group = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
})

export const label = style({
  fontSize: vars.textSize.sm,
  color: vars.text.muted,
  fontFamily: vars.font.ui,
})
