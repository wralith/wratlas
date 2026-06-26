import { recipe } from "@vanilla-extract/recipes"
import { vars } from "../../../styles/vars.css.ts"

export const flex = recipe({
  base: {
    display: "flex",
  },
  variants: {
    inline: {
      true: { display: "inline-flex" },
    },
    direction: {
      row: {},
      column: { flexDirection: "column" },
    },
    justify: {
      start: {},
      center: { justifyContent: "center" },
      end: { justifyContent: "flex-end" },
      between: { justifyContent: "space-between" },
      around: { justifyContent: "space-around" },
      evenly: { justifyContent: "space-evenly" },
    },
    align: {
      start: {},
      center: { alignItems: "center" },
      end: { alignItems: "flex-end" },
      stretch: { alignItems: "stretch" },
      baseline: { alignItems: "baseline" },
    },
    wrap: {
      true: { flexWrap: "wrap" },
    },
    gap: {
      xs: { gap: vars.space.xs },
      sm: { gap: vars.space.sm },
      md: { gap: vars.space.md },
      lg: { gap: vars.space.lg },
      xl: { gap: vars.space.xl },
    },
  },
})
