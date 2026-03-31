import { style } from "@vanilla-extract/css";

export const container = style({
  width: "100%",
  height: "100%",
  position: "relative",
});

export const loadingFallback = style({
  height: "100%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f9fafb",
  color: "#9ca3af",
  fontWeight: 500,
});

export const addHorseButton = style({
  position: "absolute",
  left: "10px"
})
