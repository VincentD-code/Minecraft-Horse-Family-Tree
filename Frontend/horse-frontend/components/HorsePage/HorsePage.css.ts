import { style } from "@vanilla-extract/css";

export const pageWrapper = style({
  padding: "40px 20px",
  margin: "0 auto",
  backgroundColor: "#fdfbf7",
  minHeight: "100vh",
  borderLeft: "8px solid #2d4a3e",
  fontFamily: "Inter, system-ui, sans-serif",
});

export const buttonRow = style({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
})

export const deleteButton = style({
  marginLeft: "15px"
})
