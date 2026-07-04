import type { JSX } from "preact"
import { Card } from "@/ui/atoms/card/card"
import { Checkbox } from "@/ui/atoms/checkbox/checkbox"
import { Flex } from "@/ui/atoms/flex/flex"
import { Tag } from "@/ui/atoms/tag/tag"
import { Tooltip } from "@/ui/atoms/tooltip/tooltip"
import {
  card,
  checkboxWrap,
  content,
  dimensions,
  moreTag,
  name,
  tagsRow,
  thumbnail,
  thumbnailWrap,
} from "./image-card.css.ts"

const MAX_VISIBLE_TAGS = 3

export type ImageCardProps = {
  name: string
  tags: string[]
  width: number
  height: number
  thumbnailUrl: string
  selected?: boolean
  onToggle?: () => void
  onContextMenu?: (e: JSX.TargetedMouseEvent<HTMLDivElement>) => void
  onClick?: (e: JSX.TargetedMouseEvent<HTMLDivElement>) => void
}

export const ImageCard = (props: ImageCardProps) => {
  const { name: label, tags, width, height, thumbnailUrl, selected, onToggle, onContextMenu, onClick } = props

  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS)
  const overflowCount = tags.length - MAX_VISIBLE_TAGS

  return (
    <Card class={card} onContextMenu={onContextMenu} onClick={onClick}>
      <div class={thumbnailWrap}>
        <img src={thumbnailUrl} alt={label} class={thumbnail} />
      </div>
      <div class={content}>
        <div class={name}>{label}</div>
        <div class={dimensions}>
          {width} &times; {height}
        </div>

        <Flex align="center" gap="xs" justify="between">
          <div class={checkboxWrap} onClick={e => e.stopPropagation()}>
            <Checkbox checked={!!selected} onChange={() => onToggle?.()} />
          </div>
          {tags.length > 0 && (
            <Flex gap="xs" class={tagsRow}>
              {visibleTags.map(t => (
                <Tag key={t}>{t}</Tag>
              ))}
              {overflowCount > 0 && (
                <Tooltip
                  content={
                    <Flex gap="xs">
                      {tags.map(t => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </Flex>
                  }
                  placement="bottom"
                  portal={false}
                >
                  <span class={moreTag}>+{overflowCount} more</span>
                </Tooltip>
              )}
            </Flex>
          )}
        </Flex>
      </div>
    </Card>
  )
}
