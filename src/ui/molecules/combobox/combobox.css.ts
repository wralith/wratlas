import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const root = style({
  position: "relative",
  minWidth: 0,
  flex: 1,
  "@media": {
    "screen and (min-width: 1024px)": {
      minWidth: 220,
      flex: "none",
    },
  },
})

export const trigger = style({
  width: "100%",
  height: 30,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.bg.base,
  color: vars.text.primary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  padding: "0 8px",
  borderRadius: vars.radius.xs,
  outline: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.sm,
  cursor: "pointer",
})

export const triggerLabel = style({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
})

export const panel = style({
  position: "absolute",
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

export const panelBottom = style({
  top: "calc(100% + 6px)",
})

export const panelTop = style({
  bottom: "calc(100% + 6px)",
})

export const search = style({
  padding: vars.space.sm,
  borderBottom: `1px solid ${vars.color.border}`,
})

export const list = style({
  listStyle: "none",
  margin: 0,
  padding: vars.space.xs,
  maxHeight: 220,
  overflowY: "auto",
})

export const optionButton = style({
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

export const optionButtonSelected = style({
  backgroundColor: `color-mix(in srgb, ${vars.color.primary} 20%, transparent)`,
  color: vars.color.primary,
  selectors: {
    "&:hover": {
      backgroundColor: `color-mix(in srgb, ${vars.color.primary} 20%, transparent)`,
    },
  },
})

export const empty = style({
  padding: `${vars.space.sm} ${vars.space.sm}`,
  color: vars.text.muted,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
})

export const actions = style({
  borderTop: `1px solid ${vars.color.border}`,
  padding: vars.space.xs,
  display: "grid",
  gap: vars.space.xs,
})

export const actionButton = style({
  width: "100%",
  height: 30,
  border: "none",
  borderRadius: vars.radius.xs,
  backgroundColor: "transparent",
  color: vars.text.primary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  textAlign: "left",
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.sm,
  padding: `0 ${vars.space.sm}`,
  cursor: "pointer",
  selectors: {
    "&:hover:not(:disabled)": {
      backgroundColor: `color-mix(in srgb, ${vars.color.border} 80%, transparent)`,
    },
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
})

export const actionDanger = style({
  color: vars.color.danger,
})
