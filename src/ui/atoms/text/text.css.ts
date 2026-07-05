import { recipe } from "@vanilla-extract/recipes"
import { vars } from "@/styles/vars.css.ts"

export const text = recipe({
  base: {
    margin: 0,
    fontFamily: vars.font.ui,
    lineHeight: 1.5,
  },
  variants: {
    size: {
      xs: { fontSize: vars.textSize.xs },
      sm: { fontSize: vars.textSize.sm },
      base: { fontSize: vars.textSize.base },
      lg: { fontSize: vars.textSize.lg },
      xl: { fontSize: vars.textSize.xl },
    },
    color: {
      primary: { color: vars.text.primary },
      secondary: { color: vars.text.secondary },
      muted: { color: vars.text.muted },
    },
    weight: {
      normal: { fontWeight: 400 },
      medium: { fontWeight: 500 },
      semibold: { fontWeight: 600 },
      bold: { fontWeight: 700 },
    },
  },
  defaultVariants: {
    size: "sm",
    color: "primary",
    weight: "normal",
  },
})
