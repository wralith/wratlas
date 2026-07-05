import { computed, signal } from "@preact/signals"

export type NotificationType = "success" | "error" | "info" | "warning"

export type Notification = {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration: number
}

type NotificationInput = {
  type: NotificationType
  title: string
  message?: string
  duration?: number
}

const list = signal<Notification[]>([])
let next_id = 0
const gen_id = () => `n_${++next_id}`
const DEFAULT_DURATION = 4000

export const add_notification = (input: NotificationInput): string => {
  const id = gen_id()
  const notif: Notification = {
    ...input,
    id,
    duration: input.duration ?? DEFAULT_DURATION,
  }
  list.value = [...list.value, notif]

  if (notif.duration > 0) {
    setTimeout(() => remove_notification(id), notif.duration)
  }

  return id
}

export const remove_notification = (id: string) => {
  list.value = list.value.filter(n => n.id !== id)
}

export const notifications = computed(() => list.value.toReversed())
