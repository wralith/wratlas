import { keyframes, style } from "@vanilla-extract/css"
import { recipe } from "@vanilla-extract/recipes"
import { vars } from "../../../styles/vars.css.ts"

const spin = keyframes({
  to: { transform: "rotate(360deg)" },
})

export const spinner = style({
  width: 14,
  height: 14,
  border: "2px solid currentColor",
  borderTopColor: "transparent",
  borderRadius: "50%",
  animation: `${spin} 0.6s linear infinite`,
})

export const label = style({
  lineHeight: 1,
})

export const labelIconOnly = style({
  lineHeight: 0,
})

export const button = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    border: `2px solid ${vars.color.border}`,
    height: 30,
    borderRadius: vars.radius.xs,
    padding: "6px 12px",
    fontFamily: vars.font.ui,
    fontSize: vars.textSize.sm,
    fontWeight: 600,
    cursor: "pointer",
    transition: `opacity ${vars.transition.fast}, transform ${vars.transition.fast}`,
    selectors: {
      "&:disabled": {
        opacity: 0.5,
        cursor: "not-allowed",
        pointerEvents: "none",
      },
      "&:active:not(:disabled)": {
        transform: "scale(0.98)",
      },
    },
  },
  variants: {
    color: {
      primary: {
        backgroundColor: vars.color.primary,
        borderColor: vars.color.primary,
        color: vars.color.dark,
      },
      secondary: {
        backgroundColor: vars.color.secondary,
        borderColor: vars.color.secondary,
        color: vars.color.dark,
      },
    },
    size: {
      "icon-only": {
        padding: 6,
      },
      large: {
        padding: "10px 20px",
        height: 36,
        fontSize: vars.textSize.base,
        gap: 10,
      },
    },
  },
})
