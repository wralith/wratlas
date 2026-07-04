import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const container = style({
  minHeight: vars.hudHeight,
  margin: "1.5rem",
  marginTop: 0,
  position: "absolute",
  width: "calc(100% - 3rem)",
  zIndex: vars.z.roadmapLines,
})

export const label = style({
  fontSize: vars.textSize.sm,
  color: vars.text.muted,
  fontFamily: vars.font.ui,
})

export const shortcutsList = style({
  display: "grid",
  gap: vars.space.sm,
})

export const shortcutsRow = style({
  display: "grid",
  gridTemplateColumns: "minmax(180px, 1fr) auto",
  alignItems: "center",
  gap: vars.space.lg,
})

export const shortcutKeys = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: vars.space.xs,
})

export const shortcutKeyPart = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.xs,
})

export const shortcutPlus = style({
  color: vars.text.muted,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
})

export const shortcutLabel = style({
  color: vars.text.primary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  whiteSpace: "nowrap",
})
