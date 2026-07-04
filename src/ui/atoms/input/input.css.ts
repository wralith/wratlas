import { keyframes, style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

const spin = keyframes({
  to: { transform: "rotate(360deg)" },
})

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
  boxSizing: "border-box",
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
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
      pointerEvents: "none",
    },
    "&:focus": {
      borderColor: vars.color.primary,
      outline: "none",
    },
    "&:focus-visible": {
      outline: "none",
    },
  },
})

export const inputError = style({
  borderColor: vars.color.danger,
})

export const inputRow = style({
  display: "flex",
  alignItems: "center",
  gap: 6,
})

export const inputSpinner = style({
  width: 14,
  height: 14,
  border: "2px solid currentColor",
  borderTopColor: "transparent",
  borderRadius: "50%",
  animation: `${spin} 0.6s linear infinite`,
  color: vars.text.muted,
  flexShrink: 0,
})

export const errorText = style({
  fontSize: vars.textSize.xs,
  color: vars.color.danger,
  lineHeight: 1,
})

export const wrapper = style({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  width: "100%",
})

export const label = style({
  fontSize: vars.textSize.xs,
  color: vars.text.muted,
})
