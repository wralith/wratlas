import { style } from "@vanilla-extract/css"
import { inputBase } from "@/ui/atoms/base-input/base-input.css.ts"

export const textarea = style([
  inputBase,
  {
    width: "100%",
    minHeight: 60,
    padding: "6px 8px",
    resize: "vertical",
  },
])
