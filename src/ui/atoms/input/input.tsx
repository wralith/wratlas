import type { JSX, Ref } from "preact"
import { cn } from "@/lib/cn"
import { input, label as labelStyle, wrapper } from "./input.css.ts"

export type InputProps = JSX.IntrinsicElements["input"] & {
  ref?: Ref<HTMLInputElement>
  label?: string
}

export const Input = (props: InputProps) => {
  const { ref, label, id, ...rest } = props
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)

  if (label) {
    return (
      <div class={wrapper}>
        <label for={inputId} class={labelStyle}>
          {label}
        </label>
        <input ref={ref} id={inputId} {...rest} class={cn(input, rest.class)} />
      </div>
    )
  }

  return <input ref={ref} id={id} {...rest} class={cn(input, rest.class)} />
}
