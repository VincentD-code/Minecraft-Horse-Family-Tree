import { style } from "@vanilla-extract/css";

export const statRow = style({
  display: "flex",
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "8px 0",
});

export const statInput = style({
  width: "120px",
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #e5e7eb",
  fontSize: "13px",
  ":focus": {
    outline: "none",
    borderColor: "#2d4a3e",
  },
});

export const label = style({
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontSize: "11px",
  fontWeight: 800,
  color: "#2d4a3e",
});
