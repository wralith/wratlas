import { keyframes, style } from "@vanilla-extract/css"
import { recipe } from "@vanilla-extract/recipes"
import { vars } from "@/styles/vars.css.ts"

const slideIn = keyframes({
  from: { opacity: 0, transform: "translateX(100%)" },
  to: { opacity: 1, transform: "translateX(0)" },
})

export const container = style({
  position: "fixed",
  top: 27,
  right: 124,
  zIndex: 10000,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  pointerEvents: "none",
})

export const itemWrapper = style({
  pointerEvents: "auto",
})

export const toast = recipe({
  base: {
    display: "flex",
    alignItems: "flex-start",
    gap: vars.space.sm,
    padding: `${vars.space.sm} ${vars.space.md}`,
    backgroundColor: vars.bg.surface,
    border: `1px solid ${vars.color.border}`,
    borderLeft: `3px solid ${vars.color.border}`,
    fontFamily: vars.font.ui,
    fontSize: vars.textSize.sm,
    color: vars.text.primary,
    animation: `${slideIn} 200ms ease-out`,
    maxWidth: 360,
    boxShadow: vars.shadow.float,
  },
  variants: {
    type: {
      success: { borderLeftColor: vars.color.success },
      error: { borderLeftColor: vars.color.danger },
      info: { borderLeftColor: vars.color.tertiary },
      warning: { borderLeftColor: vars.color.warning },
    },
  },
})

export const icon = style({
  flexShrink: 0,
  marginTop: 2,
  lineHeight: 0,
  color: vars.text.secondary,
})

export const body = style({
  flex: 1,
  minWidth: 0,
})

export const title = style({
  fontWeight: 600,
  lineHeight: 1.3,
})

export const message = style({
  color: vars.text.secondary,
  marginTop: 2,
  lineHeight: 1.3,
})

export const close = style({
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 18,
  height: 18,
  marginTop: 1,
  background: "none",
  border: "none",
  color: vars.text.muted,
  cursor: "pointer",
  padding: 0,
  lineHeight: 0,
  selectors: {
    "&:hover": { color: vars.text.primary },
  },
})
