import type { ComponentChildren } from "preact"
import { Header } from "../header"
import styles from "./page-layout.module.css"

export type PageLayoutProps = {
  children: ComponentChildren
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div class={styles.layout}>
      <Header />
      <main class={styles.content}>{children}</main>
    </div>
  )
}
