import { style } from "@vanilla-extract/css"
import { mobileAndTablet } from "@/lib/responsive.css"
import { vars } from "@/styles/vars.css.ts"

export const container = style({
  margin: "1rem",
  marginBottom: "0.5rem",
  position: "relative",
  zIndex: `calc(${vars.z.hud} + 1)`,
  "@media": {
    [mobileAndTablet]: {
      display: "none",
    },
  },
})

export const brand = style({
  fontSize: vars.textSize.lg,
  color: vars.color.primary,
  fontWeight: 700,
})

export const settingsWrapper = style({
  position: "relative",
  zIndex: vars.z.hud,
})

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 1rem",
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.bg.surface,
  borderRadius: vars.radius.md,
  height: 60,
})

export const link = style({
  "@media": {
    [mobileAndTablet]: {
      display: "none",
    },
  },
})

export const linkActive = style({
  position: "relative",
  color: vars.color.secondary,
  "::after": {
    content: "",
    position: "absolute",
    top: 31,
    left: 0,
    width: "100%",
    height: 4,
    backgroundColor: vars.color.secondary,
  },
})

export const colorPicker = style({
  vars: {
    "--cp-size": "30px",
    "--cp-border-radius-sm": "0",
    "--cp-border-radius-lg": "0",
    "--cp-body-bg": vars.bg.surface,
    "--cp-body-color": vars.text.primary,
    "--cp-border-color": vars.color.border,
    "--cp-hover-color": vars.text.secondary,
    "--cp-button-color": vars.color.secondary,
    "--cp-box-shadow": "none",
    "--cp-box-shadow-sm": "none",
  },
})
