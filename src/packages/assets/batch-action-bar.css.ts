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

export const batchActions = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
})

export const batchActionBtn = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  height: 30,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.xs,
  backgroundColor: vars.bg.base,
  color: vars.text.primary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  padding: `0 ${vars.space.sm}`,
  cursor: "pointer",
  outline: "none",
  whiteSpace: "nowrap",
  selectors: {
    "&:hover": {
      backgroundColor: vars.color.border,
    },
  },
})

export const batchActionBtnActive = style({
  borderColor: vars.color.primary,
  color: vars.color.primary,
})

export const batchActionBtnDanger = style({
  color: vars.color.danger,
  selectors: {
    "&:hover": {
      backgroundColor: `color-mix(in srgb, ${vars.color.danger} 15%, transparent)`,
      borderColor: vars.color.danger,
    },
  },
})

export const batchCount = style({
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  color: vars.text.secondary,
  whiteSpace: "nowrap",
})

export const popoverContainer = style({
  position: "relative",
})

export const popover = style({
  position: "absolute",
  bottom: "calc(100% + 8px)",
  left: 0,
  minWidth: 260,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.bg.surface,
  boxShadow: vars.shadow.float,
  zIndex: vars.z.overlayTop,
  overflow: "hidden",
  padding: vars.space.sm,
})

export const inlineInput = style({
  width: "100%",
  height: 30,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.xs,
  backgroundColor: vars.bg.base,
  color: vars.text.primary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  padding: `0 ${vars.space.sm}`,
  outline: "none",
  boxSizing: "border-box",
  selectors: {
    "&:focus": {
      borderColor: vars.color.primary,
    },
  },
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

export const selectAllCheckbox = style({
  width: 18,
  height: 18,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 3,
  backgroundColor: vars.bg.base,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "#fff",
  selectors: {
    "&:hover": {
      borderColor: vars.color.primary,
    },
  },
})

export const selectAllFloat = style({
  position: "fixed",
  bottom: 24,
  left: 24,
  zIndex: vars.z.overlayTop,
})

export const selectAllFloatBtn = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  height: 34,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.xs,
  backgroundColor: vars.bg.surface,
  color: vars.text.primary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  padding: `0 ${vars.space.md}`,
  cursor: "pointer",
  outline: "none",
  boxShadow: vars.shadow.float,
  selectors: {
    "&:hover": {
      backgroundColor: vars.color.border,
    },
  },
})
