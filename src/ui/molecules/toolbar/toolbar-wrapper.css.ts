import { style } from "@vanilla-extract/css"
import { mobileAndTablet } from "@/lib/responsive.css"

export const toolbarWrapper = style({
  margin: "0 1.5rem",
  "@media": {
    [mobileAndTablet]: {
      margin: "0.5rem 1rem 0",
    },
  },
})
