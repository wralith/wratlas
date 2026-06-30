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
      primary: {
        color: vars.color.primary,
      },
      secondary: {
        color: vars.color.secondary,
      },
      info: {
        color: vars.color.tertiary,
      },
      success: {
        color: vars.color.success,
      },
      warning: {
        color: vars.color.warning,
      },
      warn: {
        color: vars.color.warning,
      },
      error: {
        color: vars.color.danger,
      },
      danger: {
        color: vars.color.danger,
      },
    },
    variant: {
      default: {},
      outline: {
        backgroundColor: "transparent",
      },
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
  compoundVariants: [
    {
      variants: { color: "primary", variant: "default" },
      style: { backgroundColor: vars.color.primary, borderColor: vars.color.primary, color: vars.color.dark },
    },
    {
      variants: { color: "secondary", variant: "default" },
      style: { backgroundColor: vars.color.secondary, borderColor: vars.color.secondary, color: vars.color.dark },
    },
    {
      variants: { color: "info", variant: "default" },
      style: { backgroundColor: vars.color.tertiary, borderColor: vars.color.tertiary, color: vars.color.dark },
    },
    {
      variants: { color: "success", variant: "default" },
      style: { backgroundColor: vars.color.success, borderColor: vars.color.success, color: vars.color.dark },
    },
    {
      variants: { color: "warning", variant: "default" },
      style: { backgroundColor: vars.color.warning, borderColor: vars.color.warning, color: vars.color.dark },
    },
    {
      variants: { color: "warn", variant: "default" },
      style: { backgroundColor: vars.color.warning, borderColor: vars.color.warning, color: vars.color.dark },
    },
    {
      variants: { color: "error", variant: "default" },
      style: { backgroundColor: vars.color.danger, borderColor: vars.color.danger, color: vars.color.dark },
    },
    {
      variants: { color: "danger", variant: "default" },
      style: { backgroundColor: vars.color.danger, borderColor: vars.color.danger, color: vars.color.dark },
    },
    {
      variants: { color: "primary", variant: "outline" },
      style: { borderColor: vars.color.primary, color: vars.color.primary },
    },
    {
      variants: { color: "secondary", variant: "outline" },
      style: { borderColor: vars.color.secondary, color: vars.color.secondary },
    },
    {
      variants: { color: "info", variant: "outline" },
      style: { borderColor: vars.color.tertiary, color: vars.color.tertiary },
    },
    {
      variants: { color: "success", variant: "outline" },
      style: { borderColor: vars.color.success, color: vars.color.success },
    },
    {
      variants: { color: "warning", variant: "outline" },
      style: { borderColor: vars.color.warning, color: vars.color.warning },
    },
    {
      variants: { color: "warn", variant: "outline" },
      style: { borderColor: vars.color.warning, color: vars.color.warning },
    },
    {
      variants: { color: "error", variant: "outline" },
      style: { borderColor: vars.color.danger, color: vars.color.danger },
    },
    {
      variants: { color: "danger", variant: "outline" },
      style: { borderColor: vars.color.danger, color: vars.color.danger },
    },
    {
      variants: { color: "primary", variant: "light" },
      style: {
        backgroundColor: "color-mix(in srgb, #f9e2af 20%, transparent)",
        borderColor: "color-mix(in srgb, #f9e2af 55%, #313244)",
        color: vars.color.primary,
      },
    },
    {
      variants: { color: "secondary", variant: "light" },
      style: {
        backgroundColor: "color-mix(in srgb, #cba6f7 20%, transparent)",
        borderColor: "color-mix(in srgb, #cba6f7 55%, #313244)",
        color: vars.color.secondary,
      },
    },
    {
      variants: { color: "info", variant: "light" },
      style: {
        backgroundColor: "color-mix(in srgb, #f5c2e7 20%, transparent)",
        borderColor: "color-mix(in srgb, #f5c2e7 55%, #313244)",
        color: vars.color.tertiary,
      },
    },
    {
      variants: { color: "success", variant: "light" },
      style: {
        backgroundColor: "color-mix(in srgb, #a6e3a1 20%, transparent)",
        borderColor: "color-mix(in srgb, #a6e3a1 55%, #313244)",
        color: vars.color.success,
      },
    },
    {
      variants: { color: "warning", variant: "light" },
      style: {
        backgroundColor: "color-mix(in srgb, #fab387 20%, transparent)",
        borderColor: "color-mix(in srgb, #fab387 55%, #313244)",
        color: vars.color.warning,
      },
    },
    {
      variants: { color: "warn", variant: "light" },
      style: {
        backgroundColor: "color-mix(in srgb, #fab387 20%, transparent)",
        borderColor: "color-mix(in srgb, #fab387 55%, #313244)",
        color: vars.color.warning,
      },
    },
    {
      variants: { color: "error", variant: "light" },
      style: {
        backgroundColor: "color-mix(in srgb, #f38ba8 20%, transparent)",
        borderColor: "color-mix(in srgb, #f38ba8 55%, #313244)",
        color: vars.color.danger,
      },
    },
    {
      variants: { color: "danger", variant: "light" },
      style: {
        backgroundColor: "color-mix(in srgb, #f38ba8 20%, transparent)",
        borderColor: "color-mix(in srgb, #f38ba8 55%, #313244)",
        color: vars.color.danger,
      },
    },
  ],
  defaultVariants: {
    color: "neutral",
    variant: "default",
    size: "medium",
  },
})
