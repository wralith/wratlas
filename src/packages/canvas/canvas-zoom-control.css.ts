import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const container = style({
  position: "absolute",
  right: vars.space.md,
  bottom: 58,
  zIndex: vars.z.roadmapLines,
  width: 202,
  display: "grid",
  gap: vars.space.xs,
  padding: vars.space.sm,
  borderRadius: vars.radius.sm,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.bg.surface,
  boxShadow: vars.shadow.float,
})

export const topRow = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
  height: 32,
})

export const label = style({
  color: vars.text.muted,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  whiteSpace: "nowrap",
  paddingBottom: 4,
})

export const numberInputWrap = style({
  marginLeft: "auto",
  width: 76,
  position: "relative",
})

export const numberInput = style({
  width: "100%",
  fontSize: vars.textSize.sm,
  height: 24,
  paddingRight: 20,
})

export const numberSuffix = style({
  position: "absolute",
  right: vars.space.xs,
  top: "50%",
  transform: "translateY(-50%)",
  color: vars.text.secondary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  pointerEvents: "none",
})
