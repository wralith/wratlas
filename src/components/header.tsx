import { clsx } from "clsx"
import { Paintbrush, Settings } from "lucide-preact"
import { useLocation } from "preact-iso"
import { Anchor } from "./atoms/anchor/anchor"
import { Button } from "./atoms/button/button"
import { Flex } from "./atoms/flex/flex"
import { container, brand, header, link, linkActive } from "./header.css.ts"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Playground", href: "/playground" },
  { label: "Library", href: "/library" },
  { label: "Journey", href: "/journey" },
]

export const Header = () => {
  const { url } = useLocation()

  return (
    <div class={container}>
      <header class={header}>
        <Flex align="center" justify="between" gap="lg">
          <span class={brand}>Wratlas</span>
          <Flex gap="sm">
            {navLinks.map(navLink => (
              <Anchor key={navLink.href} href={navLink.href} class={clsx(link, url === navLink.href && linkActive)}>
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
