import { style } from "@vanilla-extract/css"
import { mobile, tablet } from "@/lib/responsive.css"
import { vars } from "@/styles/vars.css.ts"

export const card = style({
  width: 280,
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
  "@media": {
    [tablet]: {
      width: "calc(33.333% - 11px)",
      minWidth: 220,
    },
    [mobile]: {
      width: "100%",
    },
  },
})

export const thumbnailWrap = style({
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

export const content = style({
  marginTop: vars.space.md,
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
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
})

export const tagsRow = style({
  overflow: "hidden",
  minWidth: 0,
})

export const checkboxWrap = style({
  flexShrink: 0,
})

export const moreTag = style({
  fontSize: vars.textSize.xs,
  color: vars.text.muted,
  cursor: "pointer",
  whiteSpace: "nowrap",
  selectors: {
    "&:hover": {
      color: vars.color.primary,
    },
  },
})
