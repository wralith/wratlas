import { style } from "@vanilla-extract/css"
import { mobileAndTablet } from "@/lib/responsive.css"

export const layout = style({
  display: "flex",
  gap: "var(--space-lg)",
  alignItems: "stretch",
  "@media": {
    [mobileAndTablet]: {
      flexDirection: "column",
      alignItems: "stretch",
      gap: "var(--space-lg)",
    },
  },
})

export const wheelColumn = style({
  flexShrink: 0,
  width: 300,
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-xl)",
  "@media": {
    [mobileAndTablet]: {
      width: "100%",
      alignItems: "center",
      gap: "var(--space-lg)",
    },
  },
})

export const swatchColumn = style({
  display: "flex",
  flexDirection: "row",
  gap: "var(--space-xs)",
  flex: 1,
  marginLeft: 42,
  "@media": {
    [mobileAndTablet]: {
      flexDirection: "row",
      gap: "var(--space-sm)",
      marginLeft: 0,
      minHeight: 80,
    },
  },
})

export const swatchItem = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "var(--space-md)",
  "@media": {
    [mobileAndTablet]: {
      flexDirection: "column-reverse",
      gap: "var(--space-sm)",
    },
  },
})

export const swatchBox = style({
  flex: 1,
  width: "100%",
  "@media": {
    [mobileAndTablet]: {
      minHeight: 56,
    },
  },
})

export const wheelContainer = style({
  "@media": {
    [mobileAndTablet]: {
      maxWidth: 280,
    },
  },
})
