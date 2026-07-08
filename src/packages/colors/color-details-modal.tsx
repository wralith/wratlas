import iro from "@jaames/iro"
import type { IroColorPicker } from "@jaames/iro/dist/ColorPicker"
import { useComputed, useSignal } from "@preact/signals"
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

const padTo5 = (colors: string[]): string[] => {
  const cs = [...colors]
  const fallback = cs[0] ?? "#000000"
  while (cs.length < 5) cs.push(fallback)
  return cs
}

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
    if (!palette) return
    dominant.value = palette.colors[0]
    harmony.value = palette.harmony
    harmony_colors.value = palette.colors
    name.value = palette.name
  }, [palette?.id])

  useEffect(() => {
    if (!wheelElement) return

    if (containerRef.current) {
      containerRef.current.remove()
      containerRef.current = null
    }
    pickerRef.current = null

    const container = document.createElement("div")
    containerRef.current = container
    wheelElement.appendChild(container)

    const harmonyColors =
      harmony.value === "none" ? padTo5(harmony_colors.value) : build_harmony(dominant.value, harmony.value)
    harmony_colors.value = harmonyColors

    const picker = iro.ColorPicker(container, {
      width: 300,
      colors: harmonyColors,
      layout: [
        { component: iro.ui.Wheel },
        { component: iro.ui.Slider, options: { sliderType: "hue" } },
        { component: iro.ui.Slider, options: { sliderType: "saturation" } },
        { component: iro.ui.Slider, options: { sliderType: "value" } },
      ],
    })

    let isInternal = false

    const syncHandles = () => {
      if (isInternal) return
      const activeIndex = picker.color.index
      const activeHex = picker.color.hexString
      dominant.value = activeHex

      if (harmony.value === "none") {
        harmony_colors.value = picker.colors.map(c => c.hexString)
        return
      }

      isInternal = true
      const computed = build_harmony(activeHex, harmony.value)
      harmony_colors.value = computed
      picker.colors[activeIndex].hexString = computed[0]
      let ci = 1
      picker.colors.forEach((c, i) => {
        if (i !== activeIndex) {
          c.hexString = computed[ci] ?? computed[0]
          ci++
        }
      })
      isInternal = false
    }

    picker.on("color:change", syncHandles)
    picker.on("color:setActive", syncHandles)

    pickerRef.current = picker

    return () => {
      if (containerRef.current) {
        containerRef.current.remove()
        containerRef.current = null
      }
      pickerRef.current = null
    }
  }, [wheelElement, harmony.value])

  if (!palette) return null

  const colors5 = useComputed(() => {
    const cs = [...harmony_colors.value]
    const fallback = harmony.value === "none" ? (cs[0] ?? "#000000") : ""
    while (cs.length < 5) cs.push(fallback)
    return cs
  })

  const handleHarmonyChange = (id: string) => {
    const h = id as HarmonyType
    harmony.value = h
    if (h === "none") {
      harmony_colors.value = padTo5([dominant.value])
    } else {
      harmony_colors.value = build_harmony(dominant.value, h)
    }
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
        <Flex direction="column" gap="lg" maxW={720}>
          <Flex gap="lg" align="stretch">
            <Flex direction="column" gap="md" style={{ flexShrink: 0, width: 300 }}>
              <div ref={setWheelElement} class="wheel-container"></div>

              <Flex direction="column" gap="xs">
                <Text color="muted">Harmony</Text>
                <Select
                  ariaLabel="Harmony"
                  value={harmony.value}
                  options={HARMONY_OPTIONS}
                  onChange={handleHarmonyChange}
                />
              </Flex>
            </Flex>

            <Flex direction="row" gap="xs" flex={1}>
              {colors5.value.map((c, i) => (
                <Flex key={i} direction="column" flex={1} align="center" gap="xs">
                  <Box
                    flex={1}
                    w="100%"
                    bg={c || "transparent"}
                    bd={
                      i === 0 && c
                        ? "2px solid var(--color-primary)"
                        : c
                          ? "1px solid var(--color-border)"
                          : "1px dashed var(--color-border)"
                    }
                    title={c || undefined}
                  />
                  {c && <Text size="xs">{c}</Text>}
                </Flex>
              ))}
            </Flex>
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
