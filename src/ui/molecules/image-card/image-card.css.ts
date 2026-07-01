import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const card = style({
  width: 220,
  overflow: "hidden",
})

export const thumbnail = style({
  width: "100%",
  height: 160,
  objectFit: "cover",
  borderRadius: vars.radius.sm,
  display: "block",
  background: vars.bg.overlay,
})

export const content = style({
  marginTop: vars.space.sm,
})

export const name = style({
  fontSize: vars.textSize.sm,
  color: vars.text.primary,
  fontWeight: 500,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
})

export const dimensions = style({
  fontSize: vars.textSize.xs,
  color: vars.text.muted,
  marginTop: vars.space.xs,
})

export const footer = style({
  marginTop: vars.space.sm,
})
