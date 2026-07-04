import { keyframes, style } from "@vanilla-extract/css"
import { recipe } from "@vanilla-extract/recipes"
import { vars } from "@/styles/vars.css.ts"

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
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  lineHeight: 1,
})

export const labelIconOnly = style({
  lineHeight: 0,
})

type ColorKey = "primary" | "secondary" | "info" | "success" | "warning" | "danger"

const colorTokens: Record<ColorKey, string> = {
  primary: vars.color.primary,
  secondary: vars.color.secondary,
  info: vars.color.tertiary,
  success: vars.color.success,
  warning: vars.color.warning,
  danger: vars.color.danger,
}

const compoundVariants = (Object.keys(colorTokens) as ColorKey[]).flatMap(color => {
  const token = colorTokens[color]
  return [
    {
      variants: { color, variant: "default" as const },
      style: { backgroundColor: token, borderColor: token, color: vars.color.dark },
    },
    {
      variants: { color, variant: "outline" as const },
      style: { borderColor: token, color: token },
    },
    {
      variants: { color, variant: "light" as const },
      style: {
        backgroundColor: `color-mix(in srgb, ${token} 20%, transparent)`,
        borderColor: `color-mix(in srgb, ${token} 55%, ${vars.color.border})`,
        color: token,
      },
    },
  ]
})

export const button = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    border: `2px solid ${vars.color.border}`,
    backgroundColor: vars.bg.base,
    color: vars.text.primary,
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
      neutral: {},
      primary: { color: vars.color.primary },
      secondary: { color: vars.color.secondary },
      info: { color: vars.color.tertiary },
      success: { color: vars.color.success },
      warning: { color: vars.color.warning },
      danger: { color: vars.color.danger },
    },
    variant: {
      default: {},
      outline: { backgroundColor: "transparent" },
      light: {},
    },
    size: {
      small: {
        gap: 6,
        height: 24,
        padding: "4px 8px",
        fontSize: "0.6875rem",
      },
      medium: {},
      large: {
        gap: 10,
        height: 36,
        padding: "10px 20px",
        fontSize: vars.textSize.base,
      },
      "icon-only": {
        padding: 6,
      },
    },
  },
  compoundVariants,
  defaultVariants: {
    color: "neutral",
    variant: "default",
    size: "medium",
  },
})
