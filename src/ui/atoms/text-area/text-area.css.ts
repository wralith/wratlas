import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"
import { inputBase } from "@/ui/atoms/base-input/base-input.css.ts"

export const textarea = style([
  inputBase,
  {
    width: "100%",
    minHeight: 60,
    padding: "6px 8px",
    resize: "vertical",
    background: vars.bg.base,
    outline: "none",
    selectors: {
      "&:focus": {
        borderColor: vars.color.primary,
        outline: "none",
      },
      "&:focus-visible": {
        outline: "none",
      },
    },
  },
])
