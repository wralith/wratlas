import { Paintbrush, Settings } from "lucide-preact"
import { useLocation } from "preact-iso"
import { Anchor } from "./atoms/anchor/anchor"
import { Button } from "./atoms/button/button"
import { Flex } from "./atoms/flex/flex"
import styles from "./header.module.css"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Playground", href: "/playground" },
  { label: "Library", href: "/library" },
  { label: "Journey", href: "/journey" },
]

export const Header = () => {
  const { url } = useLocation()

  return (
    <div class={styles.container}>
      <header class={styles.header}>
        <Flex align="center" justify="between" gap="lg">
          <span class={styles.brand}>Wratlas</span>
          <Flex gap="sm">
            {navLinks.map(link => (
              <Anchor
                key={link.href}
                href={link.href}
                class={styles.link}
                data-active={url === link.href ? "" : undefined}
              >
                {link.label}
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
