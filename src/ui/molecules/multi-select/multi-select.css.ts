import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const root = style({
  position: "relative",
})

export const trigger = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.xs,
  width: "100%",
  minHeight: 30,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.bg.base,
  color: vars.text.primary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  padding: "2px 4px",
  borderRadius: vars.radius.xs,
  outline: "none",
  cursor: "pointer",
  selectors: {
    "&:focus-within": {
      borderColor: vars.color.primary,
    },
  },
})

export const pills = style({
  display: "flex",
  flex: 1,
  flexWrap: "wrap",
  alignItems: "center",
  gap: 2,
  overflow: "hidden",
  minWidth: 0,
})

export const placeholder = style({
  color: vars.text.muted,
  padding: "0 4px",
})

export const pill = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 2,
  padding: `${vars.space.xs} ${vars.space.xs}`,
  fontSize: vars.textSize.xs,
  background: vars.bg.overlay,
  color: vars.text.secondary,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.xs,
  lineHeight: 1,
  whiteSpace: "nowrap",
})

export const pillMore = style({
  display: "inline-flex",
  alignItems: "center",
  padding: `${vars.space.xs} ${vars.space.xs}`,
  fontSize: vars.textSize.xs,
  color: vars.text.muted,
  lineHeight: 1,
  whiteSpace: "nowrap",
})

export const pillRemove = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 14,
  height: 14,
  border: "none",
  background: "transparent",
  color: vars.text.muted,
  cursor: "pointer",
  padding: 0,
  borderRadius: vars.radius.xs,
  selectors: {
    "&:hover": {
      color: vars.color.danger,
      background: `color-mix(in srgb, ${vars.color.danger} 15%, transparent)`,
    },
  },
})

export const chevron = style({
  flexShrink: 0,
  color: vars.text.muted,
})

export const search = style({
  padding: vars.space.sm,
  borderBottom: `1px solid ${vars.color.border}`,
})

export const panel = style({
  position: "absolute",
  top: "calc(100% + 6px)",
  left: 0,
  width: "100%",
  minWidth: 220,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.bg.surface,
  boxShadow: vars.shadow.float,
  zIndex: vars.z.overlayTop,
  overflow: "hidden",
})

export const list = style({
  listStyle: "none",
  margin: 0,
  padding: vars.space.xs,
  maxHeight: 220,
  overflowY: "auto",
})

export const empty = style({
  padding: `${vars.space.sm} ${vars.space.sm}`,
  color: vars.text.muted,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
})

export const option = style({
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
  border: "none",
  borderRadius: vars.radius.xs,
  backgroundColor: "transparent",
  color: vars.text.primary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  textAlign: "left",
  padding: `${vars.space.xs} ${vars.space.sm}`,
  cursor: "pointer",
  selectors: {
    "&:hover": {
      backgroundColor: `color-mix(in srgb, ${vars.color.border} 80%, transparent)`,
    },
  },
})

export const optionSelected = style({
  backgroundColor: `color-mix(in srgb, ${vars.color.primary} 20%, transparent)`,
  color: vars.color.primary,
  selectors: {
    "&:hover": {
      backgroundColor: `color-mix(in srgb, ${vars.color.primary} 20%, transparent)`,
    },
  },
})

export const actions = style({
  borderTop: `1px solid ${vars.color.border}`,
  padding: vars.space.xs,
})

export const deselectAll = style({
  width: "100%",
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.sm,
  height: 30,
  border: "none",
  borderRadius: vars.radius.xs,
  backgroundColor: "transparent",
  color: vars.color.danger,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  textAlign: "left",
  padding: `0 ${vars.space.sm}`,
  cursor: "pointer",
  selectors: {
    "&:hover": {
      backgroundColor: `color-mix(in srgb, ${vars.color.danger} 15%, transparent)`,
    },
  },
})
