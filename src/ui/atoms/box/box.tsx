import type { JSX, Ref } from "preact"
import { cn } from "@/lib/cn"

const resolve = (v: string | number | undefined): string | undefined =>
  v !== undefined ? (typeof v === "number" ? `${v}px` : v) : undefined

export const boxKeys = [
  "w",
  "h",
  "minW",
  "maxW",
  "flex",
  "p",
  "px",
  "py",
  "pt",
  "pb",
  "m",
  "mx",
  "my",
  "mt",
  "mb",
  "ml",
  "mr",
  "bg",
  "bd",
  "bdr",
] as const

type BoxStyleProps = {
  [K in (typeof boxKeys)[number]]?: string | number
}

export type BoxProps<T extends keyof JSX.IntrinsicElements = "div"> = BoxStyleProps & {
  as?: T
  ref?: Ref<Element>
} & JSX.IntrinsicElements["div"]

export function getBoxStyle(props: BoxStyleProps): Record<string, string> {
  const s: Record<string, string> = {}
  if (props.w !== undefined) s.width = resolve(props.w) as string
  if (props.h !== undefined) s.height = resolve(props.h) as string
  if (props.minW !== undefined) s.minWidth = resolve(props.minW) as string
  if (props.maxW !== undefined) s.maxWidth = resolve(props.maxW) as string
  if (props.flex !== undefined) s.flex = typeof props.flex === "number" ? String(props.flex) : props.flex
  if (props.p !== undefined) s.padding = resolve(props.p) as string
  if (props.px !== undefined) s.paddingInline = resolve(props.px) as string
  if (props.py !== undefined) s.paddingBlock = resolve(props.py) as string
  if (props.pt !== undefined) s.paddingTop = resolve(props.pt) as string
  if (props.pb !== undefined) s.paddingBottom = resolve(props.pb) as string
  if (props.m !== undefined) s.margin = resolve(props.m) as string
  if (props.mx !== undefined) s.marginInline = resolve(props.mx) as string
  if (props.my !== undefined) s.marginBlock = resolve(props.my) as string
  if (props.mt !== undefined) s.marginTop = resolve(props.mt) as string
  if (props.mb !== undefined) s.marginBottom = resolve(props.mb) as string
  if (props.ml !== undefined) s.marginLeft = resolve(props.ml) as string
  if (props.mr !== undefined) s.marginRight = resolve(props.mr) as string
  if (props.bg !== undefined) s.background = String(props.bg)
  if (props.bd !== undefined) s.border = String(props.bd)
  if (props.bdr !== undefined) s.borderRadius = resolve(props.bdr) as string
  return s
}

export function pickBoxProps(props: Record<string, unknown>) {
  const box: Record<string, unknown> = {}
  const rest: Record<string, unknown> = {}
  for (const key in props) {
    if ((boxKeys as readonly string[]).includes(key)) {
      box[key] = props[key]
    } else {
      rest[key] = props[key]
    }
  }
  return { box, rest }
}

export const Box = (props: BoxProps) => {
  // biome-ignore lint/suspicious/noExplicitAny: Preact JSX needs dynamic element types
  const { as, class: className, style, ref, ...raw } = props as any
  const Element = as ?? "div"
  const { box, rest } = pickBoxProps(raw)

  return (
    <Element
      ref={ref}
      class={cn(className)}
      style={{ ...getBoxStyle(box as BoxStyleProps), ...style } as JSX.CSSProperties}
      {...rest}
    />
  )
}
