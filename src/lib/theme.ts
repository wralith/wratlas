import { signal } from "@preact/signals"
import { type ThemeName, themeMap } from "@/styles/themes.css.ts"

const stored = (typeof localStorage !== "undefined" ? localStorage.getItem("app-theme") : null) as ThemeName | null

export const activeTheme = signal<ThemeName>(stored || "dracula")

export const themeOptions: { id: ThemeName; label: string }[] = [
  { id: "dracula", label: "Dracula" },
  { id: "catppuccin-mocha", label: "Catppuccin Mocha" },
  { id: "catppuccin-latte", label: "Catppuccin Latte" },
  { id: "rose-pine", label: "Rosé Pine" },
  { id: "everforest", label: "Everforest" },
  { id: "kanagawa", label: "Kanagawa" },
  { id: "kanagawa-lotus", label: "Kanagawa Lotus" },
]

export function initTheme() {
  const root = document.documentElement
  root.className = themeMap[activeTheme.value]

  activeTheme.subscribe(name => {
    root.className = themeMap[name]
    localStorage.setItem("app-theme", name)
  })
}
