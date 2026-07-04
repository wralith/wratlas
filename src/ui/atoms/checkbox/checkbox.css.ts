import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const box = style({
  width: 18,
  height: 18,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 3,
  backgroundColor: vars.bg.base,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: vars.text.primaryInverted,
  flexShrink: 0,
  lineHeight: 0,
  boxSizing: "border-box",
  selectors: {
    "&:hover": {
      borderColor: vars.color.primary,
    },
  },
})

export const boxChecked = style({
  backgroundColor: vars.color.primary,
  border: `1px solid ${vars.color.primary}`,
})
