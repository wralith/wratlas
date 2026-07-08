import { useSignal } from "@preact/signals"
import type { JSX } from "preact"
import { useRef } from "preact/hooks"
import { add_notification } from "@/lib/notifications"
import { Box } from "@/ui/atoms/box/box"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Input } from "@/ui/atoms/input/input"
import { Modal } from "@/ui/atoms/modal/modal"
import { Select } from "@/ui/atoms/select/select"
import { Text } from "@/ui/atoms/text/text"
import { extract_pixel_color } from "./extract"
import { build_harmony, HARMONY_OPTIONS } from "./harmonies"
import type { HarmonyType } from "./internal/types"
import { close_suggestion, color_store, suggested_palette } from "./state"

const Swatch = ({ color, active }: { color: string; active?: boolean }) => (
  <Box
    w={56}
    h={56}
    bg={color}
    bd={active ? "2px solid var(--text-primary)" : "1px solid var(--color-border)"}
    title={color}
  />
)

export const ColorSuggestionModal = () => {
  const suggestion = suggested_palette.value
  const open = !!suggestion

  const name = useSignal("")
  const harmony = useSignal<HarmonyType>("none")
  const picked_color = useSignal<string | null>(null)
  const crosshair = useSignal<{ x: number; y: number } | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  if (!suggestion) {
    return null
  }

  const handleImageClick = (e: JSX.TargetedMouseEvent<HTMLDivElement>) => {
    const img = imageRef.current
    if (!img) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const hex = extract_pixel_color(img, x, y)
    picked_color.value = hex
    crosshair.value = { x, y }
  }

  const base = picked_color.value ?? suggestion.colors[0] ?? "#000000"
  const displayed =
    harmony.value === "none"
      ? [base, ...suggestion.colors.filter(c => c !== base).slice(0, suggestion.colors.length - 1)]
      : build_harmony(base, harmony.value)

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
    picked_color.value = null
    crosshair.value = null
    close_suggestion()
  }

  const handleClose = () => {
    name.value = ""
    harmony.value = "none"
    picked_color.value = null
    crosshair.value = null
    close_suggestion()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      header="Suggested palette"
      content={
        <Flex direction="column" gap="md" maxW={400}>
          <Box
            w="100%"
            style={{ position: "relative", cursor: "crosshair", maxHeight: 320, overflow: "hidden" }}
            onClick={handleImageClick}
          >
            <img
              ref={imageRef}
              src={suggestion.image_url}
              alt="Source"
              style={{ width: "100%", display: "block", maxHeight: 320, objectFit: "contain" }}
            />
            {crosshair.value && (
              <Box
                w={16}
                h={16}
                bdr="50%"
                bd="2px solid #fff"
                bg="transparent"
                style={{
                  position: "absolute",
                  left: `${crosshair.value.x * 100}%`,
                  top: `${crosshair.value.y * 100}%`,
                  transform: "translate(-50%, -50%)",
                  filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.7))",
                  pointerEvents: "none",
                }}
              />
            )}
          </Box>

          <Flex gap="xs" wrap>
            {displayed.map((c, i) => (
              <Swatch key={`${c}-${i}`} color={c} active={i === 0 && picked_color.value !== null} />
            ))}
          </Flex>

          {picked_color.value && (
            <Text size="xs" color="muted">
              Picked: {picked_color.value}
            </Text>
          )}

          <Flex direction="column" gap="xs">
            <Text color="muted">Harmony</Text>
            <Select
              ariaLabel="Harmony"
              value={harmony.value}
              options={HARMONY_OPTIONS}
              onChange={id => {
                harmony.value = id as HarmonyType
              }}
            />
          </Flex>

          <Box>
            <Input
              label="Palette name"
              placeholder={`Palette ${color_store.palettes.value.length + 1}`}
              value={name.value}
              onInput={e => {
                name.value = e.currentTarget.value
              }}
            />
          </Box>
        </Flex>
      }
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Discard
          </Button>
          <Button color="primary" onClick={handleSave}>
            Save
          </Button>
        </>
      }
    />
  )
}
