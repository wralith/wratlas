import { style } from "@vanilla-extract/css"
import { desktop } from "@/lib/responsive.css"
import { vars } from "@/styles/vars.css.ts"

export const nav = style({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  height: 56,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  backgroundColor: vars.bg.surface,
  borderTop: `1px solid ${vars.color.border}`,
  zIndex: vars.z.hud,
  paddingBottom: "env(safe-area-inset-bottom, 0px)",
  "@media": {
    [desktop]: {
      display: "none",
    },
  },
})

export const navItem = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  height: "100%",
  padding: "4px 8px",
  background: "none",
  border: "none",
  color: vars.text.muted,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.xs,
  fontWeight: 600,
  cursor: "pointer",
  minHeight: 44,
  minWidth: 44,
  textDecoration: "none",
})

export const navItemActive = style({
  color: vars.color.primary,
  borderTop: `2px solid ${vars.color.primary}`,
})
