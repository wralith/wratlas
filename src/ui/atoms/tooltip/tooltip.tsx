import {
  FloatingPortal,
  flip,
  offset,
  type Placement,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react"
import type { ComponentChildren } from "preact"
import { useState } from "preact/hooks"
import { is_touch_device } from "@/lib/responsive"
import * as styles from "./tooltip.css.ts"

export type TooltipProps = {
  content: ComponentChildren
  placement?: Placement
  offset?: number
  /** @default: true */
  portal?: boolean
  children: ComponentChildren
}

export const Tooltip = (props: TooltipProps) => {
  const { content, children, placement = "bottom", offset: ofs = 8, portal = true } = props

  if (is_touch_device.value) return <>{children}</>

  const [open, setOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: placement,
    middleware: [offset(ofs), flip(), shift()],
  })

  const hover = useHover(context, {
    delay: { open: 150, close: 50 },
  })
  const focus = useFocus(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: "tooltip" })

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role])

  const referenceProps = getReferenceProps() as Record<string, unknown>
  const floatingProps = getFloatingProps() as Record<string, unknown>

  return (
    <>
      <span ref={refs.setReference} {...referenceProps} class={styles.reference}>
        {children}
      </span>
      {portal && open ? (
        <FloatingPortal>
          <TooltipContent refs={refs} floatingStyles={floatingStyles} floatingProps={floatingProps} content={content} />
        </FloatingPortal>
      ) : (
        open && (
          <TooltipContent refs={refs} floatingStyles={floatingStyles} floatingProps={floatingProps} content={content} />
        )
      )}
    </>
  )
}

const TooltipContent = (props: {
  refs: ReturnType<typeof useFloating>["refs"]
  floatingStyles: ReturnType<typeof useFloating>["floatingStyles"]
  floatingProps: Record<string, unknown>
  content: ComponentChildren
}) => {
  const { refs, floatingStyles, floatingProps, content } = props
  return (
    <div ref={refs.setFloating} style={floatingStyles} {...floatingProps} class={styles.tooltip}>
      {content}
    </div>
  )
}
