import { globalStyle } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

globalStyle(".cp_dialog", {
  vars: {
    "--cp-body-bg": vars.bg.surface,
    "--cp-body-color": vars.text.primary,
    "--cp-border-color": vars.color.border,
    "--cp-hover-color": vars.text.secondary,
    "--cp-button-color": vars.color.secondary,
    "--cp-border-color-translucent": `color-mix(in srgb, ${vars.color.border} 50%, transparent)`,
    "--cp-tertiary-color": vars.text.muted,
    "--cp-box-shadow": vars.shadow.float,
    "--cp-box-shadow-sm": "none",
    "--cp-size": "2.25rem",
    "--cp-border-radius-sm": "0",
    "--cp-border-radius-lg": "0",
    "--cp-delay": "0s",
  },
  fontFamily: vars.font.ui,
  borderRadius: 0,
})

globalStyle(".color-picker", {
  borderRadius: 0,
})

globalStyle(".cp_dialog input, .cp_dialog button", {
  fontFamily: vars.font.ui,
})

globalStyle(".cp_button", {
  borderRadius: 0,
})

globalStyle(".cp_thumb", {
  borderRadius: 0,
  width: "1rem",
  height: "1rem",
})

globalStyle(".cp_slider", {
  borderRadius: 0,
})

globalStyle(".cp_format", {
  borderRadius: "0 !important",
  fontSize: vars.textSize.xs,
  padding: "0.25rem 0.375rem",
})

globalStyle(".cp_swatch", {
  borderRadius: "0 !important",
})

globalStyle(".cp_input-group > :first-child", {
  borderRadius: 0,
})

globalStyle(".cp_input-group > :last-child", {
  borderRadius: 0,
})

globalStyle(".cp_area-hsv", {
  borderRadius: 0,
})

globalStyle(".cp_value", {
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.xs,
})

globalStyle(".cp_action", {
  borderRadius: 0,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.xs,
})
