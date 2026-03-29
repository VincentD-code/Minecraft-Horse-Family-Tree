import { style, globalStyle } from "@vanilla-extract/css";

export const statsShapeGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "24px",
  marginBottom: "40px",
});