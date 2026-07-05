import { Button } from "@/ui/atoms/button/button"
import { ColorSwatches } from "@/ui/atoms/color-swatch/color-swatch"
import { Flex } from "@/ui/atoms/flex/flex"
import { Slider } from "@/ui/atoms/slider/slider"
import * as styles from "../canvas-sidebar.css"
import { rectangle_color, text_color, text_font_family, text_font_size } from "../state"
import { fontOptions, match_fill_to_key, resolve_color } from "./helpers"

export const TextToolOptions = () => {
  const selectedKey = match_fill_to_key(text_color.value)

  return (
    <Flex direction="column" gap="xs">
      <span class={styles.label}>Font</span>
      {fontOptions.map(f => (
        <Button
          key={f.value}
          size="small"
          variant={f.value === text_font_family.value ? "outline" : "ghost"}
          color={f.value === text_font_family.value ? "primary" : "neutral"}
          class={styles.fontButton}
          onClick={() => {
            text_font_family.value = f.value
          }}
        >
          {f.label}
        </Button>
      ))}

      <Flex justify="between">
        <span class={styles.label}>Size</span>
        <span class={styles.value}>{text_font_size.value}px</span>
      </Flex>
      <Slider
        min={8}
        max={200}
        value={text_font_size.value}
        onInput={e => {
          text_font_size.value = Number.parseFloat((e.target as HTMLInputElement).value)
        }}
      />

      <span class={styles.label}>Color</span>
      <ColorSwatches
        selected={selectedKey}
        onSelect={key => {
          text_color.value = resolve_color(key)
        }}
      />
    </Flex>
  )
}

export const RectToolOptions = () => {
  const selectedKey = match_fill_to_key(rectangle_color.value)

  return (
    <Flex direction="column" gap="xs">
      <span class={styles.label}>Fill Color</span>
      <ColorSwatches
        selected={selectedKey}
        onSelect={key => {
          rectangle_color.value = resolve_color(key)
        }}
      />
    </Flex>
  )
}
