import { useSignal } from "@preact/signals"
import { HelpCircle, Settings } from "lucide-preact"
import { useEffect, useRef } from "preact/hooks"
import { useLocation } from "preact-iso"
import { brand, colorPicker, container, header, link, linkActive, settingsWrapper } from "@/components/header.css.ts"
import { SettingsDropdown } from "@/components/settings-dropdown"
import { cn } from "@/lib/cn"
import { navLinks } from "@/lib/navigation"
import type { DriveStep } from "@/lib/tour"
import { resetTour, startTour } from "@/lib/tour"
import { STEPS as assetsSteps } from "@/packages/assets/tour"
import { STEPS as canvasSteps } from "@/packages/canvas/tour"
import { STEPS as colorsSteps } from "@/packages/colors/tour"
import { Anchor } from "@/ui/atoms/anchor/anchor"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Tooltip } from "@/ui/atoms/tooltip/tooltip"
import ColorPicker from "@/vendor/jscolorpicker/colorpicker.min.js"
import "@/vendor/jscolorpicker/colorpicker.min.css"
import "@/styles/colorpicker.css.ts"

const tourSteps: Record<string, DriveStep[]> = {
  "/": canvasSteps,
  "/assets": assetsSteps,
  "/colors": colorsSteps,
}

const tourIds = {
  "/": "canvas_intro" as const,
  "/assets": "assets_intro" as const,
  "/colors": "colors_intro" as const,
}

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
          <Tooltip content="Take tour">
            <Button
              color="neutral"
              size="icon-only"
              aria-label="Take tour"
              onClick={() => {
                const tid = tourIds[url as keyof typeof tourIds]
                if (tid) {
                  resetTour(tid)
                  startTour(tid, tourSteps[url])
                }
              }}
            >
              <HelpCircle size={16} />
            </Button>
          </Tooltip>
          <div class={settingsWrapper}>
            <Button
              color="neutral"
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
