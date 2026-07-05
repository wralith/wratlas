import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const panel = style({
  position: "absolute",
  right: "1.5rem",
  top: `calc(${vars.hudHeight} + 2rem)`,
  width: 260,
  maxHeight: "calc(100% - 10rem)",
  overflowY: "auto",
  zIndex: vars.z.hud,
  backgroundColor: vars.bg.surface,
  border: `1px solid ${vars.color.border}`,
  padding: vars.space.md,
})

export const label = style({
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.xs,
  color: vars.text.muted,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
})

export const value = style({
  color: vars.color.secondary,
  fontSize: vars.textSize.xs,
  fontFamily: vars.font.ui,
})

export const numberInput = style({
  width: "100%",
  padding: "4px 6px",
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.bg.base,
  color: vars.text.primary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.xs,
  textAlign: "right",
})

export const fontButton = style({
  justifyContent: "flex-start",
})

export const flexButton = style({
  flex: 1,
})

export const tabBar = style({
  display: "flex",
  borderBottom: `1px solid ${vars.color.border}`,
  marginBottom: vars.space.md,
})

export const tabButton = style({
  flex: 1,
  padding: "4px 8px",
  border: "none",
  backgroundColor: "transparent",
  color: vars.text.muted,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.xs,
  cursor: "pointer",
  textAlign: "center",
  borderBottom: "2px solid transparent",
  marginBottom: -1,
})

export const tabActive = style({
  color: vars.text.primary,
  borderBottomColor: vars.color.primary,
})
