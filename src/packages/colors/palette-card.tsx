import { Trash2 } from "lucide-preact"
import type { JSX } from "preact"
import { Box } from "@/ui/atoms/box/box"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Text } from "@/ui/atoms/text/text"
import type { PaletteMeta } from "./internal/types"

const copy = (text: string) => {
  void navigator.clipboard.writeText(text)
}

export type PaletteCardProps = {
  palette: PaletteMeta
  onContextMenu: (e: JSX.TargetedMouseEvent<HTMLDivElement>, palette: PaletteMeta) => void
  onDelete: (id: string) => void
}

export const PaletteCard = ({ palette, onContextMenu, onDelete }: PaletteCardProps) => {
  return (
    <Flex
      direction="column"
      gap="sm"
      p="var(--space-sm)"
      bd="1px solid var(--color-border)"
      bg="var(--bg-surface)"
      onContextMenu={e => onContextMenu(e, palette)}
    >
      <Flex justify="between" align="center">
        <Text weight="semibold">{palette.name}</Text>
        <Button
          size="icon-only"
          color="danger"
          variant="ghost"
          aria-label="Delete palette"
          onClick={() => onDelete(palette.id)}
        >
          <Trash2 size={16} />
        </Button>
      </Flex>
      <Flex gap="xs" wrap>
        {palette.colors.map((c, i) => (
          <Box
            key={`${c}-${i}`}
            w={44}
            h={44}
            bg={c}
            bd="1px solid var(--color-border)"
            title={`${c} — click to copy`}
            style={{ cursor: "pointer" }}
            onClick={() => copy(c)}
          />
        ))}
      </Flex>
      <Flex justify="between" align="center">
        <Text color="muted">{palette.harmony}</Text>
        <Text color="muted">{palette.colors.length} colors</Text>
      </Flex>
    </Flex>
  )
}
