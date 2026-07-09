import { style } from "@vanilla-extract/css"
import { mobileAndTablet } from "@/lib/responsive.css"
import { vars } from "@/styles/vars.css.ts"

export const container = style({
  minHeight: vars.hudHeight,
  margin: "1.5rem",
  marginTop: 0,
  position: "absolute",
  width: "calc(100% - 3rem)",
  zIndex: vars.z.roadmapLines,
  "@media": {
    [mobileAndTablet]: {
      position: "relative",
      margin: "0.5rem 1rem 0",
      width: "auto",
      zIndex: vars.z.hud,
    },
  },
})

export const desktopOnly = style({
  "@media": {
    [mobileAndTablet]: {
      display: "none",
    },
  },
})

export const mobileOnly = style({
  display: "none",
  "@media": {
    [mobileAndTablet]: {
      display: "flex",
    },
  },
})

export const burgerContent = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xs,
  minWidth: 160,
})

export const burgerButton = style({
  width: "100%",
  border: "none",
  borderRadius: vars.radius.xs,
  background: "transparent",
  color: vars.text.primary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  textAlign: "left",
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  cursor: "pointer",
  selectors: {
    "&:hover": {
      background: `color-mix(in srgb, ${vars.color.border} 80%, transparent)`,
    },
    '&[data-active="true"]': {
      color: vars.color.primary,
      background: `color-mix(in srgb, ${vars.color.primary} 20%, transparent)`,
    },
  },
})

export const burgerSeparator = style({
  height: 1,
  background: vars.color.border,
  margin: `${vars.space.xs} 0`,
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

export const settingsAnchor = style({
  position: "relative",
})
