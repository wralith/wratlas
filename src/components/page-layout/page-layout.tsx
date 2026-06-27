import { clsx } from "clsx"
import type { ComponentChildren } from "preact"
import { Header } from "../header"
import { content, contextFull, layout } from "./page-layout.css.ts"

export type PageLayoutProps = {
  children: ComponentChildren
  full?: boolean
}

export const PageLayout = ({ children, full }: PageLayoutProps) => {
  return (
    <div class={layout}>
      <Header />
      <main class={clsx(content, full && contextFull)}>{children}</main>
    </div>
  )
}
