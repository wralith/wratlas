import { style } from "@vanilla-extract/css"
import { mobileAndTablet } from "@/lib/responsive.css"

export const swatch = style({
  width: 56,
  height: 56,
  border: "1px solid var(--color-border)",
  "@media": {
    [mobileAndTablet]: {
      width: 40,
      height: 40,
    },
  },
})

export const imageWrap = style({
  maxHeight: 320,
  overflow: "hidden",
  "@media": {
    [mobileAndTablet]: {
      maxHeight: 200,
    },
  },
})
