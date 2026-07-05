import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const root = style({
  position: "relative",
  display: "inline-block",
  width: "100%",
})

export const trigger = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.sm,
  height: 30,
  width: "100%",
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.bg.base,
  color: vars.text.primary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  padding: "0 8px",
  borderRadius: vars.radius.xs,
  cursor: "pointer",
  boxSizing: "border-box",
  textAlign: "left",
  outline: "none",
  selectors: {
    "&:hover": {
      borderColor: vars.color.primary,
    },
    "&:focus, &:focus-visible": {
      borderColor: vars.color.primary,
      outline: "none",
    },
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
      pointerEvents: "none",
    },
  },
})

export const triggerLabel = style({
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
})

export const triggerChevron = style({
  color: vars.text.muted,
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
})

export const panel = style({
  position: "fixed",
  minWidth: "max-content",
  zIndex: vars.z.overlayTop,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.bg.surface,
  boxShadow: vars.shadow.float,
  padding: vars.space.xs,
})

export const list = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "grid",
  gap: 2,
  overflow: "auto",
})

export const option = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.xs,
  width: "100%",
  border: "none",
  background: "transparent",
  color: vars.text.primary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  textAlign: "left",
  padding: `${vars.space.xs} ${vars.space.sm}`,
  cursor: "pointer",
  whiteSpace: "nowrap",
  borderRadius: vars.radius.xs,
  selectors: {
    "&:hover": {
      backgroundColor: vars.bg.base,
    },
    "&:disabled": {
      color: vars.text.muted,
      cursor: "not-allowed",
    },
  },
})

export const optionCheck = style({
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
  color: vars.color.primary,
})
