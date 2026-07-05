import { style } from "@vanilla-extract/css"
import { recipe } from "@vanilla-extract/recipes"
import { vars } from "@/styles/vars.css.ts"

export const container = style({
  display: "flex",
  gap: vars.space.xs,
  flexWrap: "wrap",
})

export const swatch = recipe({
  base: {
    width: 20,
    height: 20,
    border: `1px solid ${vars.color.border}`,
    cursor: "pointer",
    flexShrink: 0,
    padding: 0,
  },
  variants: {
    tone: {
      primary: { backgroundColor: vars.color.primary },
      secondary: { backgroundColor: vars.color.secondary },
      tertiary: { backgroundColor: vars.color.tertiary },
      success: { backgroundColor: vars.color.success },
      warning: { backgroundColor: vars.color.warning },
      danger: { backgroundColor: vars.color.danger },
      textPrimary: { backgroundColor: vars.text.primary },
      textSecondary: { backgroundColor: vars.text.secondary },
      textMuted: { backgroundColor: vars.text.muted },
    },
    active: {
      true: {
        outline: `2px solid ${vars.text.primary}`,
        outlineOffset: 1,
      },
    },
  },
  defaultVariants: {
    tone: "primary",
  },
})
