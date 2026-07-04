import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const card = style({
  width: 220,
  height: "100%",
  overflow: "hidden",
  cursor: "pointer",
  display: "flex",
  backgroundColor: vars.bg.base,
  flexDirection: "column",
  selectors: {
    "&:hover": {
      borderColor: vars.color.primary,
    },
  },
})

export const thumbnailWrap = style({
  position: "relative",
  width: "100%",
  height: 160,
})

export const thumbnail = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: vars.radius.sm,
  display: "block",
  background: vars.bg.overlay,
})

export const checkbox = style({
  position: "absolute",
  top: 6,
  left: 6,
  width: 20,
  height: 20,
  border: `2px solid ${vars.color.border}`,
  borderRadius: 3,
  backgroundColor: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "#fff",
  zIndex: 1,
  selectors: {
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.55)",
    },
  },
})

export const checkboxChecked = style({
  backgroundColor: vars.color.primary,
  borderColor: vars.color.primary,
  selectors: {
    "&:hover": {
      backgroundColor: vars.color.primary,
    },
  },
})

export const content = style({
  marginTop: vars.space.sm,
  flex: 1,
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
