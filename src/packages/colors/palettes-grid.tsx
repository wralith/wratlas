import type { JSX } from "preact"
import { Box } from "@/ui/atoms/box/box"
import { Flex } from "@/ui/atoms/flex/flex"
import { Text } from "@/ui/atoms/text/text"
import type { PaletteMeta } from "./internal/types"
import { PaletteCard } from "./palette-card"
import { color_store } from "./state"

const GRID_COLS = "repeat(auto-fill, minmax(280px, 1fr))"

export type PalettesGridProps = {
  open_context_menu: (e: JSX.TargetedMouseEvent<HTMLDivElement>, palette: PaletteMeta) => void
  onCardClick: (palette: PaletteMeta) => void
  onDeleteRequest: (id: string) => void
}

export const PalettesGrid = ({ open_context_menu, onCardClick, onDeleteRequest }: PalettesGridProps) => {
  const palettes = color_store.filtered_palettes.value

  if (palettes.length === 0) {
    return (
      <Flex justify="center" align="center" p="var(--space-xl)">
        <Text color="muted">
          No saved palettes yet. Right-click an image on the canvas and choose "Generate palette".
        </Text>
      </Flex>
    )
  }

  return (
    <Box p="1.5rem" style={{ display: "grid", gridTemplateColumns: GRID_COLS, gap: "8px" } as never}>
      {palettes.map(p => (
        <PaletteCard
          key={p.id}
          palette={p}
          onContextMenu={open_context_menu}
          onDelete={id => onDeleteRequest(id)}
          onClick={onCardClick}
        />
      ))}
    </Box>
  )
}
