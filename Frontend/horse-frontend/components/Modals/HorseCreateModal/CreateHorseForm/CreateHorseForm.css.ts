import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  margin: 10,
  padding: 10,
  borderRadius: 8,
  gap: "10px"
});

export const field = style({
  maxHeight: 40,
  maxWidth: 300,
});

export const fields = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const nameField = style({
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

export const nameRow = style({
  display: "flex",
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "8px 0",
});

export const label = style({
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontSize: "11px",
  fontWeight: 800,
  color: "#2d4a3e",
});
