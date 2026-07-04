import { createTheme } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

const base = {
  font: {
    ui: "JetBrains Mono, monospace",
    display: "Instrument Serif, serif",
  },
  textSize: {
    xs: "0.625rem",
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
  z: {
    canvasContent: "1",
    roadmapLines: "2",
    hud: "100",
    overlay: "999",
    overlayTop: "1000",
  },
  transition: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
}

export const catppuccinMocha = createTheme(vars, {
  ...base,
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
  shadow: {
    float: "0 10px 30px -10px rgba(17, 17, 27, 0.6)",
  },
})

export const catppuccinLatte = createTheme(vars, {
  ...base,
  color: {
    primary: "#df8e1d",
    secondary: "#8839ef",
    tertiary: "#ea76cb",
    success: "#40a02b",
    warning: "#fe640b",
    danger: "#d20f39",
    dark: "#e6e9ef",
    border: "#ccd0da",
  },
  bg: {
    base: "#eff1f5",
    surface: "#e6e9ef",
    overlay: "#dce0e8",
  },
  text: {
    primary: "#4c4f69",
    secondary: "#5c5f77",
    muted: "#6c6f85",
    primaryInverted: "#eff1f5",
    secondaryInverted: "#e6e9ef",
  },
  shadow: {
    float: "0 10px 30px -10px rgba(76, 79, 105, 0.15)",
  },
})

export const rosePine = createTheme(vars, {
  ...base,
  color: {
    primary: "#f6c177",
    secondary: "#c4a7e7",
    tertiary: "#eb6f92",
    success: "#9ccfd8",
    warning: "#ea9a97",
    danger: "#eb6f92",
    dark: "#191724",
    border: "#26233a",
  },
  bg: {
    base: "#191724",
    surface: "#1f1d2e",
    overlay: "#26233a",
  },
  text: {
    primary: "#e0def4",
    secondary: "#908caa",
    muted: "#6e6a86",
    primaryInverted: "#191724",
    secondaryInverted: "#1f1d2e",
  },
  shadow: {
    float: "0 10px 30px -10px rgba(25, 23, 36, 0.5)",
  },
})

export const everforest = createTheme(vars, {
  ...base,
  color: {
    primary: "#a7c080",
    secondary: "#7fbbb3",
    tertiary: "#e69875",
    success: "#a7c080",
    warning: "#dbbc7f",
    danger: "#e67e80",
    dark: "#272e33",
    border: "#475258",
  },
  bg: {
    base: "#2d353b",
    surface: "#343f44",
    overlay: "#3d484d",
  },
  text: {
    primary: "#d3c6aa",
    secondary: "#9da9a0",
    muted: "#859289",
    primaryInverted: "#2d353b",
    secondaryInverted: "#343f44",
  },
  shadow: {
    float: "0 10px 30px -10px rgba(39, 46, 51, 0.6)",
  },
})

export const kanagawa = createTheme(vars, {
  ...base,
  color: {
    primary: "#7fb4ca",
    secondary: "#e46876",
    tertiary: "#98bb6c",
    success: "#76946a",
    warning: "#c0a36e",
    danger: "#e46876",
    dark: "#16161d",
    border: "#363646",
  },
  bg: {
    base: "#1f1f28",
    surface: "#2a2a37",
    overlay: "#363646",
  },
  text: {
    primary: "#dcd7ba",
    secondary: "#c0b89c",
    muted: "#848488",
    primaryInverted: "#1f1f28",
    secondaryInverted: "#2a2a37",
  },
  shadow: {
    float: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
  },
})

export const kanagawaLotus = createTheme(vars, {
  ...base,
  color: {
    primary: "#6a9fb5",
    secondary: "#e46876",
    tertiary: "#6f894e",
    success: "#6f894e",
    warning: "#c0a36e",
    danger: "#e46876",
    dark: "#d8cdb6",
    border: "#cac0aa",
  },
  bg: {
    base: "#f2ecdf",
    surface: "#e5d9c5",
    overlay: "#d8cdb6",
  },
  text: {
    primary: "#545464",
    secondary: "#7e7e8c",
    muted: "#92929e",
    primaryInverted: "#f2ecdf",
    secondaryInverted: "#e5d9c5",
  },
  shadow: {
    float: "0 10px 30px -10px rgba(84, 84, 100, 0.15)",
  },
})

export const dracula = createTheme(vars, {
  ...base,
  color: {
    primary: "#bd93f9",
    secondary: "#ff79c6",
    tertiary: "#8be9fd",
    success: "#50fa7b",
    warning: "#ffb86c",
    danger: "#ff5555",
    dark: "#191a24",
    border: "#44475a",
  },
  bg: {
    base: "#282a36",
    surface: "#21222c",
    overlay: "#191a24",
  },
  text: {
    primary: "#f8f8f2",
    secondary: "#bfc0c9",
    muted: "#6272a4",
    primaryInverted: "#282a36",
    secondaryInverted: "#21222c",
  },
  shadow: {
    float: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
  },
})

export const themeMap = {
  dracula,
  "catppuccin-mocha": catppuccinMocha,
  "catppuccin-latte": catppuccinLatte,
  "rose-pine": rosePine,
  everforest,
  kanagawa,
  "kanagawa-lotus": kanagawaLotus,
} as const

export type ThemeName = keyof typeof themeMap
