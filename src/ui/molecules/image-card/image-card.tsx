import { Check } from "lucide-preact"
import type { JSX } from "preact"
import { cn } from "@/lib/cn"
import { Card } from "@/ui/atoms/card/card"
import { Flex } from "@/ui/atoms/flex/flex"
import { Tag } from "@/ui/atoms/tag/tag"
import {
  card,
  checkbox,
  checkboxChecked,
  content,
  dimensions,
  footer,
  name,
  thumbnail,
  thumbnailWrap,
} from "./image-card.css.ts"

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

  return (
    <Card class={card} onContextMenu={onContextMenu} onClick={onClick}>
      <div class={thumbnailWrap}>
        <img src={thumbnailUrl} alt={label} class={thumbnail} />
        <label class={cn(checkbox, selected && checkboxChecked)} onClick={e => e.stopPropagation()}>
          <input type="checkbox" checked={!!selected} onChange={() => onToggle?.()} style="display:none" />
          {selected && <Check size={12} />}
        </label>
      </div>
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
