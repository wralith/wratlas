import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const key = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 24,
  minWidth: 24,
  padding: `0 ${vars.space.sm}`,
  borderRadius: vars.radius.xs,
  border: `1px solid ${vars.color.border}`,
  background: vars.bg.base,
  boxShadow: `inset 0 -2px 0 ${vars.color.border}`,
  color: vars.text.primary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  lineHeight: 1,
  whiteSpace: "nowrap",
})

export const wide = style({
  justifyContent: "flex-start",
})
