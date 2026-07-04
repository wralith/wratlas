import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const inputBase = style({
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.bg.base,
  color: vars.text.primary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  borderRadius: vars.radius.xs,
  outline: "none",
})

export const inputError = style({
  borderColor: vars.color.danger,
})
