import { style, styleVariants } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const menu = style({
  position: "fixed",
  minWidth: 180,
  padding: vars.space.xs,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.bg.surface,
  boxShadow: vars.shadow.float,
  zIndex: vars.z.overlayTop,
})

export const list = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "grid",
  gap: 2,
})

export const item = style({
  width: "100%",
  border: "none",
  background: "transparent",
  color: vars.text.primary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.base,
  textAlign: "left",
  padding: `${vars.space.xs} ${vars.space.sm}`,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.sm,
  selectors: {
    "&:hover": {
      backgroundColor: vars.bg.base,
    },
    "&:disabled": {
      color: vars.text.muted,
      cursor: "not-allowed",
    },
    "&:disabled:hover": {
      backgroundColor: "transparent",
    },
  },
})

export const submenuArrow = style({
  color: vars.text.muted,
  fontSize: vars.textSize.sm,
  lineHeight: 1,
})

export const itemTone = styleVariants({
  default: {},
  danger: {
    color: vars.color.danger,
  },
})
