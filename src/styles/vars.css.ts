import { createGlobalTheme } from "@vanilla-extract/css"

export const vars = createGlobalTheme(":root", {
  color: {
    primary: "#f9e2af",
    secondary: "#cba6f7",
    tertiary: "#f5c2e7",
    success: "#a6e3a1",
    warning: "#fab387",
    danger: "#f38ba8",
    dark: "#11111b",
    border: "#313244",
  },
  bg: {
    base: "#1e1e2e",
    surface: "#181825",
    overlay: "#11111b",
  },
  text: {
    primary: "#cdd6f4",
    secondary: "#bac2de",
    muted: "#a6adc8",
    primaryInverted: "#1e1e2e",
    secondaryInverted: "#181825",
  },
  font: {
    ui: "JetBrains Mono, monospace",
    display: "Instrument Serif, serif",
  },
  textSize: {
    sm: "0.75rem",
    base: "0.875rem",
    lg: "1.125rem",
    xl: "2rem",
  },
  space: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  radius: {
    xs: "4px",
    sm: "6px",
    md: "12px",
    pill: "99px",
  },
  hudHeight: "48px",
  shadow: {
    float: "0 10px 30px -10px rgba(17, 17, 27, 0.6)",
  },
  z: {
    canvasContent: "1",
    roadmapLines: "2",
    hud: "100",
    overlay: "999",
  },
  transition: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
})
