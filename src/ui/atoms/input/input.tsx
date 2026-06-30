import type { JSX, Ref } from "preact"
import { cn } from "@/lib/cn"
import { input } from "./input.css.ts"

export type InputProps = JSX.IntrinsicElements["input"] & {
  ref?: Ref<HTMLInputElement>
}

export const Input = (props: InputProps) => {
  const { ref, ...rest } = props
  return <input ref={ref} {...rest} class={cn(input, rest.class)} />
}
