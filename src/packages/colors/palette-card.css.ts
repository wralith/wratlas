import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const card = style({
  display: "flex",
  flexDirection: "column",
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.bg.base,
  padding: vars.space.sm,
  borderRadius: vars.radius.xs,
  overflow: "hidden",
  selectors: {
    "&:hover": {
      borderColor: vars.color.primary,
    },
  },
})

export const swatchWrap = style({
  position: "relative",
  cursor: "pointer",
})

export const swatchOverlay = style({
  position: "absolute",
  inset: 0,
  padding: 4,
  opacity: 0,
  selectors: {
    [`${swatchWrap}:hover &`]: {
      opacity: 1,
    },
  },
})

export const swatchHex = style({
  fontSize: vars.textSize.xs,
  fontFamily: vars.font.ui,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  color: "#fff",
  padding: "2px 6px",
  borderRadius: vars.radius.xs,
  pointerEvents: "none",
  userSelect: "none",
})

export const name = style({
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
})

export const badge = style({
  fontSize: vars.textSize.xs,
  padding: "2px 6px",
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.xs,
  textTransform: "capitalize",
})
