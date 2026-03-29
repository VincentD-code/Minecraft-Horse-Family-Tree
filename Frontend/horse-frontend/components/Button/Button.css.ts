import { style } from "@vanilla-extract/css";

export const Button = style({
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontSize: "11px",
  fontWeight: 800,
  color: "#2d4a3e",
  border: "2px solid #2d4a3e",
  background: "transparent",
  padding: "10px 24px",
  marginTop: "10px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  ":hover": {
    background: "#2d4a3e",
    color: "white",
  },
});

export const danger = style({
  ":hover": {
    background: "#800505",
    borderColor: "#800505",
  },
});
