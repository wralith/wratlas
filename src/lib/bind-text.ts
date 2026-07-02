import type { Signal } from "@preact/signals"

type TargetedInputEvent = Event & {
  currentTarget: HTMLInputElement | HTMLTextAreaElement
}

export const bind_text = (sig: Signal<string>) => (e: TargetedInputEvent) => {
  sig.value = e.currentTarget.value
}
