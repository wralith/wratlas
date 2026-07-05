import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-preact"
import { type NotificationType, notifications, remove_notification } from "@/lib/notifications"
import * as styles from "./toast.css"

const ICON_MAP: Record<NotificationType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

type ToastItemProps = {
  id: string
  type: NotificationType
  title: string
  message?: string
}

const ToastItem = ({ id, type, title, message }: ToastItemProps) => {
  const Icon = ICON_MAP[type]

  return (
    <div class={styles.toast({ type })} role="alert">
      <div class={styles.icon}>
        <Icon size={16} />
      </div>
      <div class={styles.body}>
        <div class={styles.title}>{title}</div>
        {message && <div class={styles.message}>{message}</div>}
      </div>
      <button class={styles.close} onClick={() => remove_notification(id)} aria-label="Dismiss" type="button">
        <X size={14} />
      </button>
    </div>
  )
}

export const ToastContainer = () => {
  const items = notifications.value

  if (items.length === 0) return null

  return (
    <div class={styles.container}>
      {items.map(n => (
        <div class={styles.itemWrapper} key={n.id}>
          <ToastItem id={n.id} type={n.type} title={n.title} message={n.message} />
        </div>
      ))}
    </div>
  )
}
