import { style } from "@vanilla-extract/css"
import { recipe } from "@vanilla-extract/recipes"
import { vars } from "../../../styles/vars.css.ts"

export const label = style({
  lineHeight: 1,
})

export const icon = style({
  display: "inline-flex",
})

export const anchor = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontFamily: vars.font.ui,
    fontSize: vars.textSize.sm,
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
    transition: `color ${vars.transition.fast}, opacity ${vars.transition.fast}`,
    selectors: {
      "&:hover": {
        opacity: 0.8,
      },
    },
  },
  variants: {
    color: {
      primary: { color: vars.color.primary },
      secondary: { color: vars.color.secondary },
      muted: { color: vars.text.muted },
    },
    underline: {
      true: {
        textDecoration: "underline",
        textUnderlineOffset: 3,
      },
    },
  },
  defaultVariants: {
    color: "muted",
  },
})
