import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const wrapper = style({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  width: "100%",
})

export const label = style({
  fontSize: vars.textSize.xs,
  color: vars.text.muted,
})

export const field = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 4,
  minHeight: 30,
  padding: "2px 4px",
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.xs,
  backgroundColor: vars.bg.base,
  cursor: "text",
  selectors: {
    "&:focus-within": {
      borderColor: vars.color.primary,
    },
  },
})

export const tagPill = style({
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

export const tagRemove = style({
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

export const inlineInput = style({
  flex: 1,
  minWidth: 60,
  height: 24,
  border: "none",
  background: "transparent",
  color: vars.text.primary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  padding: "0 4px",
  outline: "none",
})

export const newTagHint = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  flexShrink: 0,
  fontSize: vars.textSize.xs,
  color: vars.text.muted,
  whiteSpace: "nowrap",
  padding: "0 4px",
})
