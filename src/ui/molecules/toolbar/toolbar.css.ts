import { style } from "@vanilla-extract/css"
import { mobileAndTablet } from "@/lib/responsive.css"
import { vars } from "@/styles/vars.css.ts"

export const bar = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: vars.hudHeight,
  padding: `0 ${vars.space.md}`,
  border: `1px solid ${vars.color.border}`,
  translate: "0 -1px",
  backgroundColor: vars.bg.surface,
  flexShrink: 0,
  gap: vars.space.md,
  borderRadius: `0 0 ${vars.radius.md} ${vars.radius.md}`,
  "@media": {
    [mobileAndTablet]: {
      padding: `0 ${vars.space.sm}`,
    },
  },
})
