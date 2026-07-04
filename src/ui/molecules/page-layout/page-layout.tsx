import type { ComponentChildren } from "preact"
import { Header } from "@/components/header"
import { content, layout } from "@/ui/molecules/page-layout/page-layout.css.ts"

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
