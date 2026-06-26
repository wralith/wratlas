import type { ComponentChildren } from "preact"
import { Header } from "../header"
import { layout, content } from "./page-layout.css.ts"

export type PageLayoutProps = {
  children: ComponentChildren
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div class={layout}>
      <Header />
      <main class={content}>{children}</main>
    </div>
  )
}
