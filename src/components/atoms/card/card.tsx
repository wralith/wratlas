import { clsx } from "clsx"
import type { JSX } from "preact"
import styles from "./card.module.css"

export type CardProps = {
  border?: boolean
} & JSX.IntrinsicElements["div"]

export const Card = (props: CardProps) => {
  const { border = true, children, ...rest } = props

  return (
    <div {...rest} class={clsx(styles.card, !border && styles.borderless, rest.class)}>
      {children}
    </div>
  )
}
