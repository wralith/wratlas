import type { ComponentChildren } from "preact"
import { cn } from "@/lib/cn"
import { bar } from "./toolbar.css.ts"

export type ToolbarProps = {
  children: ComponentChildren
  class?: string
}

export const Toolbar = ({ children, class: className }: ToolbarProps) => {
  return <div class={cn(bar, className)}>{children}</div>
}
