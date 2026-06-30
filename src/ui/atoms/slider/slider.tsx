import type { JSX, Ref } from "preact"
import { cn } from "@/lib/cn"
import { slider } from "./slider.css.ts"

export type SliderProps = JSX.IntrinsicElements["input"] & {
  ref?: Ref<HTMLInputElement>
}

export const Slider = (props: SliderProps) => {
  const { ref, ...rest } = props
  return <input ref={ref} type="range" {...rest} class={cn(slider, rest.class)} />
}
