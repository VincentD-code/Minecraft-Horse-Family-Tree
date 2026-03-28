import { style } from "@vanilla-extract/css";

export const pageWrapper = style({
  padding: "40px 20px",
  margin: "0 auto",
  backgroundColor: "#fdfbf7",
  minHeight: "100vh",
  borderLeft: "8px solid #2d4a3e",
  fontFamily: "Inter, system-ui, sans-serif",
});

export const editButton = style({
  position: "absolute",
  top: "20px",
  right: "20px",
})
