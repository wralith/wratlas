import { Copy, Pencil, Trash2 } from "lucide-preact"
import type { JSX } from "preact"
import { add_notification } from "@/lib/notifications"
import { Box } from "@/ui/atoms/box/box"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Text } from "@/ui/atoms/text/text"
import type { PaletteMeta } from "./internal/types"
import * as styles from "./palette-card.css.ts"

const copy = async (text: string) => {
  await navigator.clipboard.writeText(text)
  add_notification({ type: "success", title: `Copied ${text}` })
}

export type PaletteCardProps = {
  palette: PaletteMeta
  onContextMenu: (e: JSX.TargetedMouseEvent<HTMLDivElement>, palette: PaletteMeta) => void
  onDelete: (id: string) => void
  onClick?: (palette: PaletteMeta) => void
}

export const PaletteCard = ({ palette, onContextMenu, onDelete, onClick, ...rest }: PaletteCardProps) => {
  return (
    <div
      class={styles.card}
      onContextMenu={e => onContextMenu(e, palette)}
      onClick={() => onClick?.(palette)}
      style={{ cursor: onClick ? "pointer" : undefined }}
      {...(rest as Record<string, unknown>)}
    >
      <Flex w="100%" h={80}>
        {palette.colors.map((c, i) => (
          <Box
            key={`${c}-${i}`}
            flex={1}
            class={styles.swatchWrap}
            title={`${c} — click to copy`}
            onClick={e => {
              e.stopPropagation()
              copy(c)
            }}
          >
            <Box w="100%" h="100%" style={{ backgroundColor: c } as JSX.CSSProperties} />
            <Flex class={styles.swatchOverlay} justify="center" align="end">
              <span class={styles.swatchHex}>{c}</span>
            </Flex>
          </Box>
        ))}
      </Flex>

      <Flex direction="column" gap="md" p="var(--space-md)">
        <Flex justify="between" align="center" gap="sm">
          <Text weight="semibold" class={styles.name}>
            {palette.name}
          </Text>
          <Flex align="center" gap="xs">
            <Button
              size="icon-only"
              variant="ghost"
              aria-label="Edit palette"
              onClick={e => {
                e.stopPropagation()
                onClick?.(palette)
              }}
            >
              <Pencil size={14} />
            </Button>
            <Button
              size="icon-only"
              variant="ghost"
              aria-label="Copy all colors"
              onClick={e => {
                e.stopPropagation()
                copy(palette.colors.join(", "))
              }}
            >
              <Copy size={14} />
            </Button>
            <Button
              size="icon-only"
              color="danger"
              variant="ghost"
              aria-label="Delete palette"
              onClick={e => {
                e.stopPropagation()
                onDelete(palette.id)
              }}
            >
              <Trash2 size={14} />
            </Button>
          </Flex>
        </Flex>

        <Flex align="center" gap="sm">
          <span class={styles.badge}>{palette.harmony}</span>
          <Text size="xs" color="muted">
            {palette.colors.length} colors
          </Text>
        </Flex>
      </Flex>
    </div>
  )
}
