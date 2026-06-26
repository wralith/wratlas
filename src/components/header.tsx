import { Paintbrush } from "lucide-preact"
import { Button } from "./atoms/button/button"
import styles from "./header.module.css"

export const Header = () => {
  return (
    <div class={styles.container}>
      <header class={styles.header}>
        <span>Wratlas</span>
        <Button color="primary" left={<Paintbrush size={16} />}>
          Draw Gesture!
        </Button>
      </header>
    </div>
  )
}
