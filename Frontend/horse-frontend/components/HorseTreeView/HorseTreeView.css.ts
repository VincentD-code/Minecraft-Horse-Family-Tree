import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  width: "100%",
  height: "100%",
  backgroundColor: vars.color.backgroundDark,
  position: "relative",
});

export const loadingFallback = style({
  height: "100%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: vars.color.backgroundDark,
  color: vars.color.secondary,
  fontWeight: 500,
});

globalStyle(".react-flow__background path", {
  stroke: "rgba(255, 255, 255, 0.08) !important",
});

globalStyle(".react-flow__controls button", {
  backgroundColor: vars.color.white,
  borderBottom: `1px solid ${vars.color.border}`,
});

globalStyle(".react-flow__controls button:hover", {
  backgroundColor: vars.color.secondary,
});

globalStyle(".react-flow__controls button svg", {
  fill: vars.color.primary,
});

export const addHorseButton = style({
  zIndex: 1000,
  position: "absolute",
  left: "10px"
})
