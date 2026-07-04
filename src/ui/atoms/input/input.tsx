import type { JSX, Ref } from "preact"
import { cn } from "@/lib/cn"
import { errorText, input, inputError, inputRow, inputSpinner, label as labelStyle, wrapper } from "./input.css.ts"

export type InputProps = JSX.IntrinsicElements["input"] & {
  ref?: Ref<HTMLInputElement>
  label?: string
  loading?: boolean
  error?: string
}

export const Input = (props: InputProps) => {
  const { ref, label, id, loading, error, ...rest } = props
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)
  const hasDecoration = label || loading || error

  const inputEl = (
    <input
      ref={ref}
      id={inputId}
      {...rest}
      class={cn(input, error && inputError, rest.class)}
      disabled={rest.disabled || loading}
    />
  )

  if (!hasDecoration) return inputEl

  return (
    <div class={wrapper}>
      {label && (
        <label for={inputId} class={labelStyle}>
          {label}
        </label>
      )}
      <div class={inputRow}>
        {inputEl}
        {loading && <span class={inputSpinner} />}
      </div>
      {error && <span class={errorText}>{error}</span>}
    </div>
  )
}
