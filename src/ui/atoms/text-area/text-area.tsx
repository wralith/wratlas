import type { JSX, Ref } from "preact"
import { cn } from "@/lib/cn"
import { BaseInput } from "@/ui/atoms/base-input/base-input"
import { label as labelStyle, wrapper } from "@/ui/atoms/input/input.css.ts"
import { textarea } from "./text-area.css.ts"

export type TextAreaProps = JSX.IntrinsicElements["textarea"] & {
  ref?: Ref<HTMLTextAreaElement>
  label?: string
}

export const TextArea = (props: TextAreaProps) => {
  const { ref, label, id, ...rest } = props
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)

  if (label) {
    return (
      <div class={wrapper}>
        <label for={inputId} class={labelStyle}>
          {label}
        </label>
        <BaseInput as="textarea" ref={ref} id={inputId} {...rest} class={cn(textarea, rest.class)} />
      </div>
    )
  }

  return <BaseInput as="textarea" ref={ref} id={id} {...rest} class={cn(textarea, rest.class)} />
}
