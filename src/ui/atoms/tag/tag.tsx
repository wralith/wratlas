import type { JSX } from "preact"
import { cn } from "@/lib/cn"
import { active, clickable, tag } from "./tag.css.ts"

export type TagProps = {
  active?: boolean
} & JSX.IntrinsicElements["span"]

export const Tag = (props: TagProps) => {
  const { active: is_active, onClick, children, ...rest } = props

  return (
    <span {...rest} onClick={onClick} class={cn(tag, onClick && clickable, is_active && active, rest.class)}>
      {children}
    </span>
  )
}
