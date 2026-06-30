import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const input = style({
  height: 30,
  width: "100%",
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.bg.base,
  color: vars.text.primary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  padding: "0 8px",
  borderRadius: vars.radius.xs,
  outline: "none",
})
