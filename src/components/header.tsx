import { Paintbrush, Settings } from "lucide-preact"
import { useLocation } from "preact-iso"
import { brand, container, header, link, linkActive } from "@/components/header.css.ts"
import { cn } from "@/lib/cn"
import { navLinks } from "@/lib/navigation"
import { Anchor } from "@/ui/atoms/anchor/anchor"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"

export const Header = () => {
  const { url } = useLocation()

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
          <Button color="secondary" left={<Paintbrush size={16} />}>
            Draw Gesture!
          </Button>
          <Button color="primary" size="icon-only">
            <Settings size={18} />
          </Button>
        </Flex>
      </header>
    </div>
  )
}
