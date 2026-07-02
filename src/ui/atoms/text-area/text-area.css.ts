import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const textarea = style({
  width: "100%",
  minHeight: 60,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.bg.base,
  color: vars.text.primary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  padding: "6px 8px",
  borderRadius: vars.radius.xs,
  outline: "none",
  resize: "vertical",
})
