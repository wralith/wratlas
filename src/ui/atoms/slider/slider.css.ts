import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const slider = style({
  width: "100%",
  height: 4,
  borderRadius: vars.radius.pill,
  background: vars.color.border,
  outline: "none",
  WebkitAppearance: "none",
  appearance: "none",
  selectors: {
    "&::-webkit-slider-thumb": {
      WebkitAppearance: "none",
      appearance: "none",
      width: 14,
      height: 14,
      borderRadius: "50%",
      border: `1px solid ${vars.color.border}`,
      background: vars.color.primary,
      cursor: "pointer",
    },
    "&::-moz-range-thumb": {
      width: 14,
      height: 14,
      borderRadius: "50%",
      border: `1px solid ${vars.color.border}`,
      background: vars.color.primary,
      cursor: "pointer",
    },
  },
})
