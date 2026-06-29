import { keyframes, style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
})

export const overlay = style({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(17, 17, 27, 0.6)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
  zIndex: vars.z.overlay,
  animation: `${fadeIn} 200ms ease-out`,
})

const spin = keyframes({
  to: { transform: "rotate(360deg)" },
})

export const spinner = style({
  width: 36,
  height: 36,
  border: "3px solid rgba(205, 214, 244, 0.15)",
  borderTopColor: vars.text.primary,
  borderRadius: "50%",
  animation: `${spin} 0.8s linear infinite`,
})
