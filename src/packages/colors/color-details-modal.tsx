import { useSignal } from "@preact/signals"
import { useEffect, useRef, useState } from "preact/hooks"
import { add_notification } from "@/lib/notifications"
import { Box } from "@/ui/atoms/box/box"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Input } from "@/ui/atoms/input/input"
import { Modal } from "@/ui/atoms/modal/modal"
import { Select } from "@/ui/atoms/select/select"
import { Text } from "@/ui/atoms/text/text"
import { build_harmony, HARMONY_OPTIONS } from "./harmonies"
import type { HarmonyType, PaletteMeta } from "./internal/types"
import { color_store } from "./state"
import iro from "@jaames/iro"
import type { IroColorPicker } from "@jaames/iro/dist/ColorPicker"

const HarmonySwatch = ({ color, size }: { color: string; size?: number }) => (
  <Box w={size ?? 40} h={size ?? 40} bg={color} bdr="50%" bd="1px solid var(--color-border)" title={color} />
)

export type ColorDetailsModalProps = {
  palette: PaletteMeta | null
  onClose: () => void
}

export const ColorDetailsModal = ({ palette, onClose }: ColorDetailsModalProps) => {
  const [wheelElement, setWheelElement] = useState<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const pickerRef = useRef<IroColorPicker | null>(null)

  const dominant = useSignal(palette?.colors[0] ?? "#000000")
  const harmony = useSignal<HarmonyType>(palette?.harmony ?? "none")
  const harmony_colors = useSignal<string[]>(palette?.colors ?? [])
  const name = useSignal(palette?.name ?? "")

  useEffect(() => {
    if (!wheelElement || !palette) {
      console.log("wheelRef.current or palette is null, skipping color picker initialization")
      return
    }

    if (containerRef.current) containerRef.current.remove()
    containerRef.current = null
    pickerRef.current = null

    const container = document.createElement("div")
    containerRef.current = container
    wheelElement.appendChild(container)

    const picker = iro.ColorPicker(container, {
      width: 300,
      color: palette.colors[0],
      layout: [
        { component: iro.ui.Wheel },
        { component: iro.ui.Slider, options: { sliderType: "hue" } },
        { component: iro.ui.Slider, options: { sliderType: "saturation" } },
        { component: iro.ui.Slider, options: { sliderType: "value" } },
      ],
    })

    picker.on("color:change", color => {
      dominant.value = color.hexString
      harmony_colors.value = build_harmony(color.hexString, harmony.value)
    })

    pickerRef.current = picker

    return () => {
      if (containerRef.current) {
        containerRef.current.remove()
        containerRef.current = null
      }
      pickerRef.current = null
    }
  }, [wheelElement])

  if (!palette) return null

  const handleHarmonyChange = (id: string) => {
    const h = id as HarmonyType
    harmony.value = h
    harmony_colors.value = build_harmony(dominant.value, h)
  }

  const handleSave = () => {
    color_store.update_palette(palette.id, {
      name: name.value.trim() || palette.name,
      colors: harmony_colors.value,
      harmony: harmony.value,
    })
    add_notification({ type: "success", title: "Palette updated" })
    onClose()
  }

  return (
    <Modal
      open={!!palette}
      onClose={onClose}
      header={palette.name}
      content={
        <Flex direction="column" align="center" gap="lg" maxW={360}>
          <div ref={setWheelElement} class="wheel-container"></div>

          <Flex gap="sm" wrap justify="center">
            {harmony_colors.value.map((c, i) => (
              <HarmonySwatch key={`${c}-${i}`} color={c} size={i === 0 ? 48 : 40} />
            ))}
          </Flex>

          <Text size="xs" color="muted">
            Dominant: {dominant.value}
          </Text>

          <Flex direction="column" gap="xs" w="100%">
            <Text color="muted">Harmony</Text>
            <Select
              ariaLabel="Harmony"
              value={harmony.value}
              options={HARMONY_OPTIONS}
              onChange={handleHarmonyChange}
            />
          </Flex>

          <Box w="100%">
            <Input
              label="Palette name"
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
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSave}>
            Save
          </Button>
        </>
      }
    />
  )
}
