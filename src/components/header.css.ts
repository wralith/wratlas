import { style } from "@vanilla-extract/css"
import { vars } from "../styles/vars.css.ts"

export const container = style({
  margin: "1rem",
})

export const brand = style({
  fontSize: vars.textSize.lg,
  color: vars.color.primary,
  fontWeight: 700,
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

export const link = style({})

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
