import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const tag = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  fontSize: vars.textSize.xs,
  background: vars.bg.overlay,
  color: vars.text.secondary,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.xs,
  lineHeight: 1,
  whiteSpace: "nowrap",
})

export const clickable = style({
  cursor: "pointer",
  selectors: {
    "&:hover": {
      background: vars.color.border,
      color: vars.text.primary,
    },
  },
})

export const active = style({
  background: vars.color.primary,
  color: vars.text.primaryInverted,
  borderColor: vars.color.primary,
  selectors: {
    "&:hover": {
      background: vars.color.primary,
      color: vars.text.primaryInverted,
    },
  },
})
