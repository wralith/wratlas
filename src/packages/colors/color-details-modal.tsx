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
import { Text } from "@/ui/atoms/text/text"
import { build_harmony } from "./harmonies"
import type { HarmonyType, PaletteMeta } from "./internal/types"
import { color_store } from "./state"

const HARMONY_SUGGESTIONS: HarmonyType[] = [
  "analogous",
  "monochromatic",
  "triad",
  "tetrad",
  "splitcomplement",
  "complement",
]

const HARMONY_LABELS: Record<HarmonyType, string> = {
  none: "None",
  analogous: "Analogous",
  monochromatic: "Monochromatic",
  triad: "Triad",
  tetrad: "Tetrad",
  splitcomplement: "Split Complement",
  complement: "Complement",
}

const ColorBox = ({ color, isDominant }: { color: string; isDominant?: boolean }) => (
  <Flex direction="column" align="center" gap="xs">
    <Box
      w={isDominant ? 48 : 40}
      h={isDominant ? 48 : 40}
      bg={color}
      bd={isDominant ? "2px solid var(--color-primary)" : "1px solid var(--color-border)"}
      title={color}
    />
    <Text size="xs">{color}</Text>
  </Flex>
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

    const harmonyColors = build_harmony(dominant.value, harmony.value)
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

      isInternal = true
      const computed = build_harmony(activeHex, harmony.value)
      console.log(dominant)
      console.log(computed)
      console.log(harmony.value)
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

  const suggestions = useComputed(() =>
    HARMONY_SUGGESTIONS.map(h => ({ type: h, colors: build_harmony(dominant.value, h) })),
  )

  const handleHarmonySelect = (h: HarmonyType) => {
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
        <Flex direction="column" align="center" gap="lg" maxW={500}>
          <div ref={setWheelElement} class="wheel-container"></div>

          <Flex direction="column" gap="sm" w="100%">
            <Text color="muted">Palette</Text>
            <Flex gap="sm" wrap>
              {harmony_colors.value.map((c, i) => (
                <ColorBox key={`${c}-${i}`} color={c} isDominant={i === 0} />
              ))}
            </Flex>
          </Flex>

          <Flex direction="column" gap="xs" w="100%">
            <Text color="muted">Harmony</Text>
            <Flex gap="sm" wrap>
              {suggestions.value.map(({ type, colors }) => {
                const isSelected = harmony.value === type
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleHarmonySelect(type)}
                    title={HARMONY_LABELS[type]}
                    style={{
                      border: isSelected ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
                      background: isSelected ? "var(--color-surface-2)" : "transparent",
                      padding: 0,
                      width: "calc(50% - var(--space-xs))",
                      cursor: "pointer",
                    }}
                  >
                    <Flex h={24}>
                      {colors.map((c, i) => (
                        <Box key={`${c}-${i}`} flex={1} bg={c} />
                      ))}
                    </Flex>
                    <Box px="xs" py="xs">
                      <Text size="xs">{HARMONY_LABELS[type]}</Text>
                    </Box>
                  </button>
                )
              })}
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
