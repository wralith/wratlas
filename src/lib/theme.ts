import { signal } from "@preact/signals"
import { themeMap, type ThemeName } from "@/styles/themes.css.ts"

const stored = (typeof localStorage !== "undefined" ? localStorage.getItem("app-theme") : null) as ThemeName | null

export const activeTheme = signal<ThemeName>(stored || "catppuccin-mocha")

export const themeOptions: { id: ThemeName; label: string }[] = [
  { id: "catppuccin-mocha", label: "Catppuccin Mocha" },
  { id: "catppuccin-latte", label: "Catppuccin Latte" },
  { id: "poimandres", label: "Poimandres" },
  { id: "rose-pine", label: "Rosé Pine" },
  { id: "everforest", label: "Everforest" },
  { id: "everforest-light", label: "Everforest Light" },
  { id: "kanagawa", label: "Kanagawa" },
  { id: "kanagawa-lotus", label: "Kanagawa Lotus" },
  { id: "dracula", label: "Dracula" },
]

export function initTheme() {
  const root = document.documentElement
  root.className = themeMap[activeTheme.value]

  activeTheme.subscribe(name => {
    root.className = themeMap[name]
    localStorage.setItem("app-theme", name)
  })
}
