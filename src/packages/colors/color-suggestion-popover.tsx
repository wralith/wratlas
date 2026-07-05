import { autoUpdate, FloatingPortal, flip, offset, shift, useFloating } from "@floating-ui/react"
import { useSignal } from "@preact/signals"
import type { JSX } from "preact"
import { useEffect } from "preact/hooks"
import { add_notification } from "@/lib/notifications"
import { Box } from "@/ui/atoms/box/box"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Input } from "@/ui/atoms/input/input"
import { Text } from "@/ui/atoms/text/text"
import { build_harmony, HARMONY_OPTIONS } from "./harmonies"
import type { HarmonyType } from "./internal/types"
import { close_suggestion, color_store, suggested_palette } from "./state"

const Swatch = ({ color }: { color: string }) => (
  <Box w={32} h={32} bg={color} bd={`1px solid var(--color-border)`} title={color} />
)

export const ColorSuggestionPopover = () => {
  const suggestion = suggested_palette.value
  const open = !!suggestion

  const { refs, floatingStyles } = useFloating({
    open,
    strategy: "fixed",
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })

  useEffect(() => {
    if (!open) return
    refs.setPositionReference({
      getBoundingClientRect: () => (suggestion ? new DOMRect(suggestion.x, suggestion.y, 0, 0) : new DOMRect()),
    })
  }, [open, suggestion, refs])

  useEffect(() => {
    if (!open) return
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close_suggestion()
    }
    const onPointerDown = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return
      if (e.target.closest("[data-color-suggestion]")) return
      close_suggestion()
    }
    document.addEventListener("keydown", onEscape)
    document.addEventListener("mousedown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onEscape)
      document.removeEventListener("mousedown", onPointerDown)
    }
  }, [open])

  const name = useSignal("")
  const harmony = useSignal<HarmonyType>("none")

  if (!suggestion) return null

  const displayed =
    harmony.value === "none" ? suggestion.colors : build_harmony(suggestion.colors[0] ?? "#000000", harmony.value)

  const handleSave = () => {
    color_store.add_palette({
      name: name.value.trim() || `Palette ${color_store.palettes.value.length + 1}`,
      colors: displayed,
      harmony: harmony.value,
      source_image_id: suggestion.source_image_id ?? undefined,
    })
    add_notification({ type: "success", title: "Palette saved" })
    name.value = ""
    harmony.value = "none"
    close_suggestion()
  }

  return (
    <FloatingPortal>
      <Box
        ref={refs.setFloating as never}
        style={floatingStyles as JSX.CSSProperties}
        w={280}
        p="var(--space-md)"
        bd="1px solid var(--color-border)"
        bg="var(--bg-surface)"
        data-color-suggestion
      >
        <Flex direction="column" gap="sm">
          <Text weight="bold">Suggested palette</Text>
          <Flex gap="xs" wrap>
            {displayed.map((c, i) => (
              <Swatch key={`${c}-${i}`} color={c} />
            ))}
          </Flex>
          <Flex direction="column" gap="xs">
            <select
              aria-label="Harmony"
              value={harmony.value}
              onChange={e => {
                harmony.value = (e.currentTarget as HTMLSelectElement).value as HarmonyType
              }}
            >
              {HARMONY_OPTIONS.map(o => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            <Input
              label="Palette name"
              placeholder="Palette name"
              value={name.value}
              onInput={e => {
                name.value = e.currentTarget.value
              }}
            />
          </Flex>
          <Flex justify="end" gap="sm">
            <Button variant="ghost" size="small" onClick={close_suggestion}>
              Discard
            </Button>
            <Button color="primary" size="small" onClick={handleSave}>
              Save
            </Button>
          </Flex>
        </Flex>
      </Box>
    </FloatingPortal>
  )
}
