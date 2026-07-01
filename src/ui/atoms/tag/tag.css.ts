import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const tag = style({
  display: "inline-flex",
  alignItems: "center",
  padding: `${vars.space.xs} ${vars.space.sm}`,
  fontSize: vars.textSize.xs,
  background: vars.bg.overlay,
  color: vars.text.secondary,
  borderRadius: vars.radius.pill,
  lineHeight: 1,
  whiteSpace: "nowrap",
})

export const clickable = style({
  cursor: "pointer",
  selectors: {
    "&:hover": {
      background: vars.color.border,
    },
  },
})

export const active = style({
  background: vars.color.primary,
  color: vars.text.primaryInverted,
})
