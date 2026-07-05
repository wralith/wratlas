import { createThemeContract } from "@vanilla-extract/css"

export const vars = createThemeContract({
  color: {
    primary: null,
    secondary: null,
    tertiary: null,
    success: null,
    warning: null,
    danger: null,
    dark: null,
    border: null,
  },
  bg: {
    base: null,
    surface: null,
    overlay: null,
  },
  text: {
    primary: null,
    secondary: null,
    muted: null,
    primaryInverted: null,
    secondaryInverted: null,
  },
  font: {
    ui: null,
    display: null,
    handwritten: null,
  },
  textSize: {
    xs: null,
    sm: null,
    base: null,
    lg: null,
    xl: null,
  },
  space: {
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
  },
  radius: {
    xs: null,
    sm: null,
    md: null,
    pill: null,
  },
  hudHeight: null,
  shadow: {
    float: null,
  },
  z: {
    canvasContent: null,
    roadmapLines: null,
    hud: null,
    overlay: null,
    overlayTop: null,
  },
  transition: {
    fast: null,
  },
})
