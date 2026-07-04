import { useSignal } from "@preact/signals"
import { Paintbrush, Settings } from "lucide-preact"
import { useEffect, useRef } from "preact/hooks"
import { useLocation } from "preact-iso"
import { brand, colorPicker, container, header, link, linkActive, settingsWrapper } from "@/components/header.css.ts"
import { SettingsDropdown } from "@/components/settings-dropdown"
import { cn } from "@/lib/cn"
import { navLinks } from "@/lib/navigation"
import { Anchor } from "@/ui/atoms/anchor/anchor"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import ColorPicker from "@/vendor/jscolorpicker/colorpicker.min.js"
import "@/vendor/jscolorpicker/colorpicker.min.css"
import "@/styles/colorpicker.css.ts"

type ColorLike = { string(format: string): string }

export const Header = () => {
  const { url } = useLocation()
  const settingsOpen = useSignal(false)
  const color = useSignal("#ff8800")
  const pickerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!pickerRef.current) return
    const picker = new ColorPicker(pickerRef.current, {
      color: color.value,
      toggleStyle: "button",
      enableEyedropper: true,
      submitMode: "instant",
      formats: ["hex", "rgb", "hsv", "hsl"],
      defaultFormat: "hex",
      enableAlpha: false,
      dialogPlacement: "bottom-end",
      swatches: null,
    })

    picker.on("pick", (c: ColorLike | null) => {
      if (c) color.value = c.string("hex")
    })

    return () => {
      picker.destroy()
    }
  }, [])

  return (
    <div class={container}>
      <header class={header}>
        <Flex align="center" justify="between" gap="lg">
          <span class={brand}>Wratlas</span>
          <Flex gap="sm">
            {navLinks.map(navLink => (
              <Anchor key={navLink.href} href={navLink.href} class={cn(link, url === navLink.href && linkActive)}>
                {navLink.label}
              </Anchor>
            ))}
          </Flex>
        </Flex>
        <Flex align="center" gap="sm">
          <button ref={pickerRef} type="button" class={colorPicker} />
          <Button variant="light" color="secondary" left={<Paintbrush size={16} />}>
            Draw Gesture!
          </Button>
          <div class={settingsWrapper}>
            <Button
              color="primary"
              size="icon-only"
              onClick={() => {
                settingsOpen.value = !settingsOpen.value
              }}
            >
              <Settings size={18} />
            </Button>
            {settingsOpen.value && (
              <SettingsDropdown
                onClose={() => {
                  settingsOpen.value = false
                }}
              />
            )}
          </div>
        </Flex>
      </header>
    </div>
  )
}
