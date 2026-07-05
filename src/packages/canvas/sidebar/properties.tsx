import type { FabricObject, IText } from "fabric"
import { Button } from "@/ui/atoms/button/button"
import { ColorSwatches } from "@/ui/atoms/color-swatch/color-swatch"
import { Flex } from "@/ui/atoms/flex/flex"
import { Slider } from "@/ui/atoms/slider/slider"
import * as styles from "../canvas-sidebar.css"
import { canvas_controller, fabric_canvas, sidebar_version } from "../state"
import { fontOptions, match_fill_to_key, measure_text_width, resolve_color, update_and_save } from "./helpers"

const SetOpacity = ({ obj }: { obj: FabricObject }) => {
  const opacity = Math.round((obj.opacity ?? 1) * 100)

  return (
    <Flex direction="column" gap="xs">
      <Flex justify="between">
        <span class={styles.label}>Opacity</span>
        <span class={styles.value}>{opacity}%</span>
      </Flex>
      <Slider
        min={0}
        max={100}
        value={opacity}
        onInput={e => {
          const v = Number.parseInt((e.target as HTMLInputElement).value, 10) / 100
          update_and_save(obj, { opacity: v })
        }}
      />
    </Flex>
  )
}

const SetImageDensity = ({ obj }: { obj: FabricObject }) => {
  const img = obj as {
    getScaledWidth: () => number
    getScaledHeight: () => number
    scaleToWidth: (w: number) => void
    scaleToHeight: (h: number) => void
  }
  const w = Math.round(img.getScaledWidth())
  const h = Math.round(img.getScaledHeight())

  return (
    <Flex direction="column" gap="xs">
      <span class={styles.label}>Density (w x h)</span>
      <Flex gap="xs" align="center">
        <input
          type="number"
          value={w}
          class={styles.numberInput}
          onChange={e => {
            const newW = Number.parseFloat((e.target as HTMLInputElement).value)
            if (Number.isNaN(newW)) return
            img.scaleToWidth(newW)
            obj.setCoords()
            fabric_canvas.value?.renderAll()
            sidebar_version.value++
            void canvas_controller.save_state()
          }}
        />
        <span class={styles.value}>x</span>
        <input
          type="number"
          value={h}
          class={styles.numberInput}
          onChange={e => {
            const newH = Number.parseFloat((e.target as HTMLInputElement).value)
            if (Number.isNaN(newH)) return
            img.scaleToHeight(newH)
            obj.setCoords()
            fabric_canvas.value?.renderAll()
            sidebar_version.value++
            void canvas_controller.save_state()
          }}
        />
      </Flex>
    </Flex>
  )
}

const SetTextProps = ({ obj }: { obj: IText }) => {
  const family = obj.fontFamily
  const size = obj.fontSize ?? 24
  const selectedKey = match_fill_to_key((obj.fill as string) ?? "")

  return (
    <Flex direction="column" gap="xs">
      <span class={styles.label}>Font</span>
      {fontOptions.map(f => (
        <Button
          key={f.value}
          size="small"
          variant={f.value === family ? "outline" : "ghost"}
          color={f.value === family ? "primary" : "neutral"}
          class={styles.fontButton}
          onClick={() => {
            update_and_save(obj, {
              fontFamily: f.value,
              width: Math.ceil(measure_text_width(obj.text, f.value, obj.fontSize)) + 4,
            })
          }}
        >
          {f.label}
        </Button>
      ))}

      <Flex justify="between">
        <span class={styles.label}>Size</span>
        <span class={styles.value}>{size}px</span>
      </Flex>
      <Slider
        min={8}
        max={200}
        value={size}
        onInput={e => {
          const v = Number.parseFloat((e.target as HTMLInputElement).value)
          update_and_save(obj, { fontSize: v, width: Math.ceil(measure_text_width(obj.text, obj.fontFamily, v)) + 4 })
        }}
      />

      <span class={styles.label}>Color</span>
      <ColorSwatches
        selected={selectedKey}
        onSelect={key => {
          update_and_save(obj, { fill: resolve_color(key) })
        }}
      />
    </Flex>
  )
}

const SetRectFill = ({ obj }: { obj: FabricObject }) => {
  const selectedKey = match_fill_to_key((obj.fill as string) ?? "")

  return (
    <Flex direction="column" gap="xs">
      <span class={styles.label}>Fill Color</span>
      <ColorSwatches
        selected={selectedKey}
        onSelect={key => {
          update_and_save(obj, { fill: resolve_color(key) })
        }}
      />
    </Flex>
  )
}

export const ObjProperties = ({ obj }: { obj: FabricObject }) => {
  const typeSpecific = () => {
    if (obj.type === "image") return <SetImageDensity obj={obj} />
    if (obj.type === "i-text" || obj.type === "textbox") return <SetTextProps obj={obj as unknown as IText} />
    if (obj.type === "rect") return <SetRectFill obj={obj} />
    return null
  }

  return (
    <Flex direction="column" gap="md">
      {typeSpecific()}
      <SetOpacity obj={obj} />
    </Flex>
  )
}
