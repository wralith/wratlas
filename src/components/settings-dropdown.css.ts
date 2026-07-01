import { style } from "@vanilla-extract/css"
import { recipe } from "@vanilla-extract/recipes"
import { vars } from "@/styles/vars.css.ts"

export const panel = style({
  position: "absolute",
  top: "calc(100% + 8px)",
  right: 0,
  minWidth: 200,
  background: vars.bg.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  boxShadow: vars.shadow.float,
  zIndex: vars.z.overlayTop,
  padding: vars.space.xs,
})

export const sectionLabel = style({
  fontSize: vars.textSize.xs,
  color: vars.text.muted,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  padding: `${vars.space.xs} ${vars.space.sm}`,
})

export const themeItem = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    gap: vars.space.sm,
    width: "100%",
    padding: `${vars.space.xs} ${vars.space.sm}`,
    borderRadius: vars.radius.xs,
    fontSize: vars.textSize.sm,
    color: vars.text.primary,
    cursor: "pointer",
    border: "none",
    background: "none",
    textAlign: "left",
    transition: `background ${vars.transition.fast}`,
  },
  variants: {
    active: {
      true: {
        color: vars.color.secondary,
      },
    },
  },
  compoundVariants: [
    {
      variants: { active: true },
      style: {
        fontWeight: 600,
      },
    },
  ],
})

export const swatch = recipe({
  base: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    flexShrink: 0,
  },
  variants: {
    theme: {
      "catppuccin-mocha": { backgroundColor: "#cba6f7" },
      "catppuccin-latte": { backgroundColor: "#8839ef" },
      poimandres: { backgroundColor: "#66d9ef" },
      "rose-pine": { backgroundColor: "#c4a7e7" },
      everforest: { backgroundColor: "#7fbbb3" },
      "everforest-light": { backgroundColor: "#3a94c5" },
      kanagawa: { backgroundColor: "#7fb4ca" },
      "kanagawa-lotus": { backgroundColor: "#6a9fb5" },
      dracula: { backgroundColor: "#bd93f9" },
    },
  },
})
