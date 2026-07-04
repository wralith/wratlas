import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const layout = style({
  display: "flex",
  flexDirection: "column",
  height: "100dvh",
})

export const content = style({
  flex: 1,
  margin: 0,
  padding: 0,
  background: vars.bg.base,
  backgroundImage: `radial-gradient(circle, ${vars.color.border} 1px, transparent 1px)`,
  backgroundSize: "24px 24px",
  borderTop: `1px solid ${vars.color.border}`,
  borderBottom: "none",
  borderLeft: "none",
  borderRight: "none",
  borderRadius: 0,
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
})
