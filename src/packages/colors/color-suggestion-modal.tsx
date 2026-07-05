import { useSignal } from "@preact/signals"
import { add_notification } from "@/lib/notifications"
import { Box } from "@/ui/atoms/box/box"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Input } from "@/ui/atoms/input/input"
import { Modal } from "@/ui/atoms/modal/modal"
import { Select } from "@/ui/atoms/select/select"
import { Text } from "@/ui/atoms/text/text"
import { build_harmony, HARMONY_OPTIONS } from "./harmonies"
import type { HarmonyType } from "./internal/types"
import { close_suggestion, color_store, suggested_palette } from "./state"

const Swatch = ({ color }: { color: string }) => (
  <Box w={56} h={56} bg={color} bd={`1px solid var(--color-border)`} title={color} />
)

export const ColorSuggestionModal = () => {
  const suggestion = suggested_palette.value
  const open = !!suggestion

  const name = useSignal("")
  const harmony = useSignal<HarmonyType>("none")

  if (!suggestion) {
    return null
  }

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
    <Modal
      open={open}
      onClose={close_suggestion}
      header="Suggested palette"
      content={
        <Flex direction="column" gap="md" maxW={400}>
          <Flex gap="xs" wrap>
            {displayed.map((c, i) => (
              <Swatch key={`${c}-${i}`} color={c} />
            ))}
          </Flex>

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
          <Button variant="ghost" onClick={close_suggestion}>
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
