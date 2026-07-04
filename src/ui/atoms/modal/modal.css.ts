import { keyframes, style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
})

export const backdrop = style({
  position: "fixed",
  inset: 0,
  zIndex: vars.z.overlayTop,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  backdropFilter: "blur(2px)",
  border: "none",
  margin: 0,
  padding: 0,
  cursor: "pointer",
  animation: `${fadeIn} 0.2s ease-in-out`,
})

export const modal = style({
  minWidth: 360,
  maxWidth: "90vw",
  background: vars.bg.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  boxShadow: vars.shadow.float,
})

export const modalWide = style({
  minWidth: 520,
  maxHeight: "80vh",
  overflowY: "auto",
})

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: `${vars.space.md} ${vars.space.md} 0`,
})

export const title = style({
  margin: 0,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.base,
  fontWeight: 600,
  color: vars.text.primary,
})

export const content = style({
  padding: vars.space.md,
})

export const footer = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: vars.space.sm,
  padding: `0 ${vars.space.md} ${vars.space.md}`,
})
