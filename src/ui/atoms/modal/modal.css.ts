import { keyframes, style } from "@vanilla-extract/css"
import { mobileAndTablet } from "@/lib/responsive.css"
import { vars } from "@/styles/vars.css.ts"

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
})

const slideUp = keyframes({
  from: { transform: "translateY(100%)" },
  to: { transform: "translateY(0)" },
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
  "@media": {
    [mobileAndTablet]: {
      alignItems: "flex-end",
    },
  },
})

export const modal = style({
  minWidth: 360,
  maxWidth: "90vw",
  maxHeight: "80vh",
  overflowY: "auto",
  background: vars.bg.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  boxShadow: vars.shadow.float,
  "@media": {
    [mobileAndTablet]: {
      minWidth: "100vw",
      maxWidth: "100vw",
      maxHeight: "90vh",
      borderRadius: "12px 12px 0 0",
      animation: `${slideUp} 0.25s ease-out`,
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    },
  },
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
