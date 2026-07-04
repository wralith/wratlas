import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const batchBar = style({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: vars.z.overlayTop,
  borderTop: `1px solid ${vars.color.border}`,
  backgroundColor: vars.bg.surface,
  boxShadow: vars.shadow.float,
})

export const batchBarBody = style({
  padding: `${vars.space.sm} ${vars.space.md}`,
})

export const batchCount = style({
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  color: vars.text.secondary,
  whiteSpace: "nowrap",
})

export const suggestions = style({
  marginTop: vars.space.xs,
  maxHeight: 150,
  overflowY: "auto",
})

export const suggestionItem = style({
  width: "100%",
  border: "none",
  background: "transparent",
  color: vars.text.primary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  textAlign: "left",
  padding: `${vars.space.xs} ${vars.space.sm}`,
  cursor: "pointer",
  borderRadius: vars.radius.xs,
  selectors: {
    "&:hover": {
      backgroundColor: `color-mix(in srgb, ${vars.color.border} 80%, transparent)`,
    },
  },
})

export const suggestionHighlight = style({
  backgroundColor: `color-mix(in srgb, ${vars.color.primary} 20%, transparent)`,
  color: vars.color.primary,
})

export const selectAllFloat = style({
  position: "fixed",
  bottom: 12,
  left: 12,
  zIndex: vars.z.overlayTop,
})
