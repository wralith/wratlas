import { useSignal } from "@preact/signals"
import { Paintbrush, Settings } from "lucide-preact"
import { useLocation } from "preact-iso"
import { brand, container, header, link, linkActive, settingsWrapper } from "@/components/header.css.ts"
import { SettingsDropdown } from "@/components/settings-dropdown"
import { cn } from "@/lib/cn"
import { navLinks } from "@/lib/navigation"
import { Anchor } from "@/ui/atoms/anchor/anchor"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"

export const Header = () => {
  const { url } = useLocation()
  const settingsOpen = useSignal(false)

  return (
    <div class={container}>
      <header class={header}>
        <Flex align="center" justify="between" gap="lg">
          <span class={brand}>Wratlas</span>
          <Flex gap="sm">
            {navLinks.map(navLink => (
              <Anchor key={navLink.href} href={navLink.href} class={cn(link, url === navLink.href && linkActive)}>
                {navLink.label}
              </Anchor>
            ))}
          </Flex>
        </Flex>
        <Flex align="center" gap="sm">
          <Button variant="light" color="secondary" left={<Paintbrush size={16} />}>
            Draw Gesture!
          </Button>
          <div class={settingsWrapper}>
            <Button
              color="primary"
              size="icon-only"
              onClick={() => {
                settingsOpen.value = !settingsOpen.value
              }}
            >
              <Settings size={18} />
            </Button>
            {settingsOpen.value && (
              <SettingsDropdown
                onClose={() => {
                  settingsOpen.value = false
                }}
              />
            )}
          </div>
        </Flex>
      </header>
    </div>
  )
}
