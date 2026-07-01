import type { JSX } from "preact"
import { Card } from "@/ui/atoms/card/card"
import { Flex } from "@/ui/atoms/flex/flex"
import { Tag } from "@/ui/atoms/tag/tag"
import { card, content, dimensions, footer, name, thumbnail } from "./image-card.css.ts"

export type ImageCardProps = {
  name: string
  tags: string[]
  width: number
  height: number
  thumbnailUrl: string
  onContextMenu?: (e: JSX.TargetedMouseEvent<HTMLDivElement>) => void
}

export const ImageCard = (props: ImageCardProps) => {
  const { name: label, tags, width, height, thumbnailUrl, onContextMenu } = props

  return (
    <Card class={card} onContextMenu={onContextMenu}>
      <img src={thumbnailUrl} alt={label} class={thumbnail} />
      <div class={content}>
        <div class={name}>{label}</div>
        <div class={dimensions}>
          {width} &times; {height}
        </div>
        {tags.length > 0 && (
          <div class={footer}>
            <Flex gap="xs" wrap>
              {tags.map(t => (
                <Tag key={t}>{t}</Tag>
              ))}
            </Flex>
          </div>
        )}
      </div>
    </Card>
  )
}
