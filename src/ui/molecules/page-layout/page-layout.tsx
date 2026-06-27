import type { ComponentChildren } from "preact"
import { Header } from "@/components/header"
import { cn } from "@/lib/cn"
import { content, contentFull, layout } from "@/ui/molecules/page-layout/page-layout.css.ts"

export type PageLayoutProps = {
  children: ComponentChildren
  full?: boolean
}

export const PageLayout = ({ children, full }: PageLayoutProps) => {
  return (
    <div class={layout}>
      <Header />
      <main class={cn(content, full && contentFull)}>{children}</main>
    </div>
  )
}
