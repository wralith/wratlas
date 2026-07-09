import { useLocation } from "preact-iso"
import { cn } from "@/lib/cn"
import { nav, navItem, navItemActive } from "./bottom-nav.css"

type NavEntry = { label: string; href: string }

const entries: NavEntry[] = [
  { label: "Canvas", href: "/" },
  { label: "Assets", href: "/assets" },
  { label: "Colors", href: "/colors" },
]

export const BottomNav = () => {
  const { url } = useLocation()

  return (
    <nav class={nav}>
      {entries.map(({ label, href }) => {
        const active = url === href
        return (
          <a key={href} href={href} class={cn(navItem, active && navItemActive)}>
            <span>{label}</span>
          </a>
        )
      })}
    </nav>
  )
}
