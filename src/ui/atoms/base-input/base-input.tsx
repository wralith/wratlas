import { cn } from "@/lib/cn"

export type BaseInputProps = {
  as?: "input" | "textarea" | "select"
  error?: boolean
} & Record<string, unknown>

export const BaseInput = ({ as: Tag = "input", error: _error, class: className, ...props }: BaseInputProps) => {
  return <Tag class={cn(className)} {...props} />
}
