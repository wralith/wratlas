import { globalStyle } from "@vanilla-extract/css"
import { mobile } from "@/lib/responsive.css"
import { vars } from "@/styles/vars.css.ts"

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
})

globalStyle("body", {
  margin: 0,
  padding: 0,
  backgroundColor: vars.bg.base,
  color: vars.text.primary,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.base,
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  overflow: "hidden",
})

globalStyle("h1, h2, h3, h4, h5, h6", {
  fontFamily: vars.font.display,
  fontWeight: 400,
  margin: 0,
  color: vars.text.primary,
  lineHeight: 1.2,
})

globalStyle("button", {
  fontFamily: vars.font.ui,
  fontWeight: 600,
  background: "none",
  border: "none",
  color: "inherit",
  cursor: "pointer",
})

globalStyle(".daily-spark", {
  fontFamily: vars.font.display,
  fontStyle: "italic",
  fontSize: vars.textSize.lg,
  color: vars.text.secondary,
})

globalStyle(".tag", {
  color: vars.color.secondary,
  fontWeight: 500,
  letterSpacing: "-0.02em",
  transition: `color ${vars.transition.fast}`,
})

globalStyle(".tag:hover", {
  color: vars.text.primary,
})

globalStyle("fieldset", {
  display: "block",
  marginInline: 0,
  borderWidth: 0,
  borderStyle: "none",
  borderColor: "unset",
  borderImage: "unset",
  paddingBlock: "unset",
  paddingInline: "unset",
})

globalStyle("input, textarea, select, button", {
  "@media": {
    [mobile]: {
      fontSize: "16px",
    },
  },
})
