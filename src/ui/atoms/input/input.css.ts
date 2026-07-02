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
  selectors: {
    '&[type="number"]': {
      MozAppearance: "textfield",
      appearance: "textfield",
    },
    '&[type="number"]::-webkit-outer-spin-button': {
      WebkitAppearance: "none",
      margin: 0,
    },
    '&[type="number"]::-webkit-inner-spin-button': {
      WebkitAppearance: "none",
      margin: 0,
    },
  },
})

export const wrapper = style({
  display: "flex",
  flexDirection: "column",
  gap: 4,
})

export const label = style({
  fontSize: vars.textSize.xs,
  color: vars.text.muted,
})
